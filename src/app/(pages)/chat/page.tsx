import Link from "next/link";
import { QUIZ_TOPICS } from "@/lib/quiz-topics";
import { ArrowUpRight, Leaf, MessageSquare } from "lucide-react";

export default function AiChat() {
    return (
        <div className="flex flex-col">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                <Leaf className="h-3 w-3" />
                Practice
            </p>

            <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground">
                A patient conversation.
            </h1>
            <p className="mt-2 max-w-prose text-sm text-muted-foreground">
                Roleplay short scenes from Foundations, Everyday, and Travel — or sharpen
                recognition with a quiet quiz.
            </p>

            <Link href="/chat/practice" className="group mt-6 block">
                <article className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/30 group-active:translate-y-0 sm:p-6">
                    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/60 blur-2xl" />
                    <div className="relative flex items-start gap-4">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
                            <MessageSquare size={18} strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                                    Conversation tutor
                                </h2>
                                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                                    Guided
                                </span>
                            </div>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                Scenario roleplays with gentle corrections and a calm session
                                summary.
                            </p>
                            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                Start conversation
                                <ArrowUpRight
                                    size={14}
                                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                            </span>
                        </div>
                    </div>
                </article>
            </Link>

            <div className="mt-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                    Recognition
                </p>
                <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-foreground">
                    Quiz topics
                </h2>
                <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                    Short multiple-choice questions. Pick a subject for today.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {QUIZ_TOPICS.map((topic) => (
                        <Link key={topic.slug} href={`/chat/${topic.slug}`} className="group block h-full">
                            <article className="flex h-full flex-col rounded-2xl border border-border bg-card p-4 shadow-soft transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/25 group-active:translate-y-0 sm:p-5">
                                <span
                                    className="flex size-9 items-center justify-center rounded-xl bg-accent text-lg"
                                    aria-hidden
                                >
                                    {topic.emoji}
                                </span>
                                <h3 className="mt-3 font-serif text-base font-semibold tracking-tight text-foreground sm:text-lg">
                                    {topic.title}
                                </h3>
                                <p className="mt-1 flex-1 text-xs leading-5 text-muted-foreground">
                                    {topic.description}
                                </p>
                                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary">
                                    Start quiz
                                    <ArrowUpRight
                                        size={13}
                                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                    />
                                </span>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
