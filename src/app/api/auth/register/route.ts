import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { parseRegisterInput } from "@/lib/auth-validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = parseRegisterInput(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid name, email, or password (min 6 characters)." },
        { status: 400 },
      );
    }

    const email = parsed.data.email;
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    await User.create({
      email,
      name: parsed.data.name || email.split("@")[0],
      passwordHash,
      onboarding: { completed: false },
      progress: {},
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("register error", error);
    return NextResponse.json(
      { success: false, error: "Could not create account. Try again." },
      { status: 500 },
    );
  }
}
