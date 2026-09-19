import Link from "next/link";
import { QUIZ_TOPICS } from "@/lib/quiz-topics";
import { Leaf, MessageSquare } from "lucide-react";

export default function AiChat() {
    return (
        <div className="flex flex-col">
            <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <Leaf className="w-3 h-3 text-[#A5C9B1]" />
                Practice
            </p>

            <h1 className="mt-2 font-display text-3xl font-medium">
                A patient conversation.
            </h1>
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                Roleplay short scenes from Foundations, Everyday, and Travel — or
                sharpen recognition with a quick quiz.
            </p>

            <Link
                href="/chat/practice"
                className="mt-6 w-full rounded-xl border border-border bg-card p-4 shadow-soft transition-transform duration-150 hover:-translate-y-0.5"
            >
                <span className="text-2xl" aria-hidden>
                    <MessageSquare className="text-primary" />
                </span>
                <h2 className="mt-3 font-display text-lg font-medium">
                    Conversation tutor
                </h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Scenario roleplays with gentle corrections and a calm session
                    summary.
                </p>
                <span className="mt-3 inline-block text-xs font-medium text-primary">
                    Start conversation →
                </span>
            </Link>

            <div className="mt-10">
                <h2 className="font-display text-2xl font-medium">Quiz topics</h2>
                <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                    Short multiple-choice questions. Pick a subject for today.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {QUIZ_TOPICS.map((topic) => (
                        <Link
                            key={topic.slug}
                            href={`/chat/${topic.slug}`}
                            className="group rounded-xl border border-border bg-card p-4 shadow-soft transition-transform duration-150 hover:-translate-y-0.5"
                        >
                            <span className="text-2xl" aria-hidden>
                                {topic.emoji}
                            </span>
                            <h3 className="mt-3 font-display text-lg font-medium">
                                {topic.title}
                            </h3>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">
                                {topic.description}
                            </p>
                            <span className="mt-3 inline-block text-xs font-medium text-primary">
                                Start quiz →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
