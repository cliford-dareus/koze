import Link from "next/link";
import { QUIZ_TOPICS } from "@/lib/quiz-topics";
import { MessageSquare } from "lucide-react";

export default function AiChat() {
    return (
        <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Practice
            </p>

            <div className="flex flex-col">
                <h1 className="mt-2 text-3xl font-medium">A patient conversation.</h1>
                
                 <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                    Short multiple-choice questions. Pick a subject that matches what you
                    want to practice today.
                </p>
                
                <Link
                    href={`/chat/practice`}
                    className="w-full mt-6 rounded-xl border border-border bg-card p-4 shadow-soft transition-transform duration-150 hover:-translate-y-0.5"
                >
                    <span className="text-2xl" aria-hidden>
                        <MessageSquare className="text-primary" />
                    </span>
                    <h2 className="mt-3 font-display text-lg font-medium">
                        Conversation
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        Have you ever had a patient conversation?
                    </p>
                    <span className="mt-3 inline-block text-xs font-medium text-primary">
                        Start conversation →
                    </span>
                </Link>
            </div>

            <div className="mt-6">
                <h1 className="mt-2 font-display text-3xl font-medium">
                    Choose a quiz topic.
                </h1>
                <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                    Short multiple-choice questions. Pick a subject that matches what you
                    want to practice today.
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
                            <h2 className="mt-3 font-display text-lg font-medium">
                                {topic.title}
                            </h2>
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
