"use client";

import { useCallback, useEffect, useState } from "react";
import SuccessModal from "./succes-modal";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/app/_components/ui/dialog";
import { cn } from "@/lib/utils";
import { recordActivity } from "@/lib/progress";

type Props = {
    quote: string;
};

type AnswerType = {
    id: number;
    text: string;
    iscorrect: boolean | undefined;
    correct: boolean;
};

function makeDistractors(quote: string): string[] {
    const words = quote?.trim().split(/\s+/).filter(Boolean);
    if (words?.length < 2) {
        return [
            `${quote} (almost)`,
            `Not quite: ${quote.slice(0, Math.max(1, quote.length - 3))}…`,
            "Something else entirely",
        ];
    }

    const swapped = [...words];
    if (swapped?.length >= 2) {
        [swapped[0], swapped[1]] = [swapped[1], swapped[0]];
    }
    const dropped = words?.filter((_, i) => i !== Math.floor(words.length / 2));
    const reversedTail = [...words.slice(0, -1), ...(words.slice(-1)[0] ? [words.slice(-1)[0].split("").reverse().join("")] : [])];

    return [
        swapped.join(" "),
        dropped.join(" "),
        reversedTail.join(" "),
    ].map((t, i) => (t === quote ? `${t} · option ${i + 1}` : t));
}

const MultiChoice = ({ quote }: Props) => {
    const router = useRouter();
    const [choices, setChoices] = useState<AnswerType[]>([]);
    const [isCorrect, setIsCorrect] = useState(false);

    const checkAnswer = (data: AnswerType) => {
        const filterChoices = (state: boolean, data: AnswerType) =>
            choices.map((choice) =>
                choice.id === data.id ? { ...choice, iscorrect: state } : choice,
            );

        if (data.correct === false) {
            setChoices(filterChoices(false, data));
            return;
        }

        setChoices(filterChoices(true, data));
        setIsCorrect(true);
        recordActivity("listening");
    };

    const completeLevel = () => {
        setIsCorrect(false);
        router.refresh();
    };

    const getAndShuffleAnswers = useCallback(() => {
        const distractors = makeDistractors(quote);
        const wrongAnswers: AnswerType[] = distractors.map((text, i) => ({
            id: i + 1,
            text,
            iscorrect: undefined,
            correct: false,
        }));

        const rightAnswer: AnswerType = {
            id: 4,
            text: quote,
            iscorrect: undefined,
            correct: true,
        };

        const array = [rightAnswer, ...wrongAnswers];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }, [quote]);

    useEffect(() => {
        setChoices(getAndShuffleAnswers());
    }, [getAndShuffleAnswers]);

    return (
        <div className="relative">
            <div className="mt-4 flex flex-col gap-2">
                {choices.map((sentence) => (
                    <button
                        type="button"
                        className={cn(
                            "rounded-xl border border-border bg-card p-3 text-left text-sm shadow-soft transition-colors",
                            sentence.iscorrect !== undefined
                                ? sentence.iscorrect === false
                                    ? "border-destructive/40 bg-destructive/10"
                                    : "border-primary/40 bg-accent"
                                : "hover:bg-muted",
                        )}
                        key={sentence.id}
                        onClick={() => checkAnswer(sentence)}
                    >
                        {sentence.text}
                    </button>
                ))}
            </div>

            {isCorrect && (
                <Dialog open={isCorrect} onOpenChange={setIsCorrect}>
                    <DialogTrigger />
                    <DialogContent className="w-[90%] rounded-xl border-border bg-card">
                        <SuccessModal quote={quote} completeLevel={completeLevel} />
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default MultiChoice;
