"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import SuccessModal from "./succes-modal";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/app/_components/ui/dialog";

type Props = {
  quote: string;
};

type AnswerType = {
  id: number;
  text: string;
  iscorrect: boolean | undefined;
  correct: boolean;
};

const MultiChoice = ({ quote }: Props) => {
  const router = useRouter();
  const [choices, setChoices] = useState<AnswerType[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);

  const checkAnswer = (data: AnswerType) => {
    const filterChoices = (state: boolean, data: AnswerType) => {
      return choices.map((choice) => {
        if (choice.id == data.id) {
          choice.iscorrect = state;
        }
        return choice;
      });
    };

    if (data.correct === false) {
      setChoices(filterChoices(false, data));
    }

    if (data.correct == true) {
      setChoices(filterChoices(true, data));
      setIsCorrect(true);
    }
  };

  const completeLevel = () => {
    setIsCorrect(false);
    router.refresh();
  };

  const getAndShuffleAnswers = () => {
    const wrongAnswers: AnswerType[] = [
      { id: 1, text: "smonthing", iscorrect: undefined, correct: false },
    ];

    const rigthAnswer = {
      id: 4,
      text: quote,
      iscorrect: undefined,
      correct: true,
    };

    const shuffleAnswer = [rigthAnswer, ...wrongAnswers];
    return shuffleAnswer;
  };

  useEffect(() => {
    setChoices(getAndShuffleAnswers());
  }, [quote]);

  return (
    <div className="relative">
      <div className="flex flex-col gap-2 mt-4">
        {choices.map((sentence) => (
          <div
            className={cn(
              "bg-slate-300 rounded-lg p-2 text-xs",
              sentence.iscorrect != undefined
                ? sentence.iscorrect === false
                  ? "bg-red-500"
                  : "bg-green-500"
                : "",
            )}
            key={sentence.id}
            onClick={() => checkAnswer(sentence)}
          >
            {sentence.text}
          </div>
        ))}
      </div>

      {isCorrect && (
        <Dialog open={isCorrect} onOpenChange={setIsCorrect}>
          <DialogTrigger></DialogTrigger>
          <DialogContent className="bg-accent-foreground border-none w-[90%] rounded-lg">
            <SuccessModal quote={quote} completeLevel={completeLevel} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MultiChoice;
