import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const onboardingSchema = z.object({
  displayName: z.string().trim().min(1).max(80),
  nativeLanguage: z.string().min(2).max(8),
  learningLanguage: z.string().min(2).max(8),
  goal: z.enum(["travel", "work", "school", "fun", "family", "other"]),
  dailyMinutes: z.number().int().min(5).max(120),
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

  return NextResponse.json({
    success: true,
    onboarding: user.onboarding ?? null,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Please complete all onboarding fields." },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    user.name = parsed.data.displayName;
    user.onboarding = {
      displayName: parsed.data.displayName,
      nativeLanguage: parsed.data.nativeLanguage,
      learningLanguage: parsed.data.learningLanguage,
      goal: parsed.data.goal,
      dailyMinutes: parsed.data.dailyMinutes,
      completed: true,
      completedAt: new Date(),
    };

    await user.save();

    return NextResponse.json({
      success: true,
      onboarding: user.onboarding,
    });
  } catch (error) {
    console.error("onboarding POST", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
