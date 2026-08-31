import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { defaultProgress, type ProgressState } from "@/lib/progress";
import { applyActivity, mergeProgress } from "@/lib/progress-server";

const activitySchema = z.object({
    kind: z.enum(["translation", "listening", "reading", "quiz"]),
    topic: z.string().optional(),
});

const mergeSchema = z.object({
    local: z.object({
        translations: z.number().optional(),
        listeningCorrect: z.number().optional(),
        readingSessions: z.number().optional(),
        quizCorrect: z.number().optional(),
        streak: z.number().optional(),
        currentWord: z.string().optional(),
        currentWordDate: z.string().optional(),
        lastActiveDate: z.string().nullable().optional(),
        lastTopic: z.string().nullable().optional(),
    }),
});

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const progress: ProgressState = {
        ...defaultProgress(),
        ...(user.progress as ProgressState | undefined),
    };

    return NextResponse.json({ success: true, progress });
}

export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        await connectDB();
        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const current: ProgressState = {
            ...defaultProgress(),
            ...(user.progress as ProgressState | undefined),
        };

        // Record a single activity
        if (body.kind) {
            const parsed = activitySchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json({ success: false, error: "Invalid activity" }, { status: 400 });
            }
            const next = applyActivity(current, parsed.data.kind, {
                topic: parsed.data.topic,
            });
            user.progress = next;
            await user.save();
            return NextResponse.json({ success: true, progress: next });
        }

        // Merge guest localStorage progress after login
        if (body.local) {
            const parsed = mergeSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json({ success: false, error: "Invalid merge payload" }, { status: 400 });
            }
            const next = mergeProgress(parsed.data.local as ProgressState, current);
            user.progress = next;
            await user.save();
            return NextResponse.json({ success: true, progress: next });
        }

        return NextResponse.json({ success: false, error: "Nothing to update" }, { status: 400 });
    } catch (error) {
        console.error("progress POST", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
