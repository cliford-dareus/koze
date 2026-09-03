import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { defaultProgress, type ProgressState } from "@/lib/progress";
import { applyActivity, mergeProgress } from "@/lib/progress-server";
import { DEFAULT_DAILY_GOAL } from "@/lib/gamification";

function normalizeProgress(raw: unknown): ProgressState {
    const base = defaultProgress();
    if (!raw || typeof raw !== "object") return base;
    const p = raw as Record<string, unknown>;

    let lessonProgress: ProgressState["lessonProgress"] = new Map();
    if (p.lessonProgress instanceof Map) {
        lessonProgress = p.lessonProgress as ProgressState["lessonProgress"];
    } else if (p.lessonProgress && typeof p.lessonProgress === "object") {
        for (const [dir, lessons] of Object.entries(
            p.lessonProgress as Record<string, unknown>,
        )) {
            if (lessons && typeof lessons === "object") {
                lessonProgress.set(
                    dir,
                    new Map(
                        Object.entries(
                            lessons as Record<
                                string,
                                { currentStep: number; completed: boolean }
                            >,
                        ),
                    ),
                );
            }
        }
    }

    let lessonsCompleted: ProgressState["lessonsCompleted"] = new Map();
    if (p.lessonsCompleted instanceof Map) {
        lessonsCompleted = p.lessonsCompleted as ProgressState["lessonsCompleted"];
    } else if (p.lessonsCompleted && typeof p.lessonsCompleted === "object") {
        if (Array.isArray(p.lessonsCompleted)) {
            // legacy flat list — stash under default direction
            lessonsCompleted.set("en-fr", p.lessonsCompleted as string[]);
        } else {
            lessonsCompleted = new Map(
                Object.entries(p.lessonsCompleted as Record<string, string[]>),
            );
        }
    }

    const lessonDirection =
        p.lessonDirection === "fr-en" || p.lessonDirection === "en-fr"
            ? p.lessonDirection
            : base.lessonDirection;

    return {
        ...base,
        ...p,
        lessonProgress,
        lessonsCompleted,
        lessonDirection,
        xp: typeof p.xp === "number" ? p.xp : 0,
        dailyGoal:
            typeof p.dailyGoal === "number" ? p.dailyGoal : DEFAULT_DAILY_GOAL,
        todayActions: typeof p.todayActions === "number" ? p.todayActions : 0,
        todayXp: typeof p.todayXp === "number" ? p.todayXp : 0,
        todayDate: typeof p.todayDate === "string" ? p.todayDate : null,
        dailyGoalMet: Boolean(p.dailyGoalMet),
        badges: Array.isArray(p.badges) ? (p.badges as string[]) : [],
    } as ProgressState;
}

const activitySchema = z.object({
    kind: z.enum(["translation", "listening", "reading", "quiz", "lesson"]),
    topic: z.string().optional(),
    lessonId: z.string().optional(),
    stepIndex: z.number().int().min(0).optional(),
    lessonCompleted: z.boolean().optional(),
    direction: z.enum(["en-fr", "fr-en"]).optional(),
});

const mergeSchema = z.object({
    local: z
        .object({
            translations: z.number().optional(),
            listeningCorrect: z.number().optional(),
            readingSessions: z.number().optional(),
            quizCorrect: z.number().optional(),
            lessonsCompletedCount: z.number().optional(),
            streak: z.number().optional(),
            currentWord: z.string().nullable().optional(),
            currentWordDate: z.string().nullable().optional(),
            lastActiveDate: z.string().nullable().optional(),
            lastTopic: z.string().nullable().optional(),
            lastLessonId: z.string().nullable().optional(),
            lessonsCompleted: z.any().optional(),
            lessonProgress: z.any().optional(),
            lessonDirection: z.enum(["en-fr", "fr-en"]).optional(),
            xp: z.number().optional(),
            dailyGoal: z.number().optional(),
            todayActions: z.number().optional(),
            todayXp: z.number().optional(),
            todayDate: z.string().nullable().optional(),
            dailyGoalMet: z.boolean().optional(),
            badges: z.array(z.string()).optional(),
        })
        .passthrough(),
});

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 },
        );
    }

    const progress = normalizeProgress(user.progress);
    return NextResponse.json({ success: true, progress });
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, error: "Unauthorized" },
            { status: 401 },
        );
    }

    try {
        const body = await req.json();
        await connectDB();
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "User not found" },
                { status: 404 },
            );
        }

        const current = normalizeProgress(user.progress);

        if (body.kind) {
            const parsed = activitySchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json(
                    { success: false, error: "Invalid activity" },
                    { status: 400 },
                );
            }
            const next = applyActivity(current, parsed.data.kind, {
                topic: parsed.data.topic,
                lessonId: parsed.data.lessonId,
                stepIndex: parsed.data.stepIndex,
                lessonCompleted: parsed.data.lessonCompleted,
                direction: parsed.data.direction,
            });
            user.progress = next as never;
            await user.save();
            return NextResponse.json({ success: true, progress: next });
        }

        if (body.local) {
            const parsed = mergeSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json(
                    { success: false, error: "Invalid merge payload" },
                    { status: 400 },
                );
            }
            const localNorm = normalizeProgress({
                ...defaultProgress(),
                ...parsed.data.local,
            });
            const next = mergeProgress(localNorm, current);
            user.progress = next as never;
            await user.save();
            return NextResponse.json({ success: true, progress: next });
        }

        return NextResponse.json(
            { success: false, error: "Nothing to update" },
            { status: 400 },
        );
    } catch (error) {
        console.error("progress POST", error);
        return NextResponse.json(
            { success: false, error: "Server error" },
            { status: 500 },
        );
    }
}
