import { GoogleGenAI, Type, type GenerationConfig } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getScenario } from "@/data/tutor-scenarios";

const genAi = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

const bodySchema = z.object({
    scenarioId: z.string().min(1),
    /** Language the learner is practicing (e.g. fr, en) */
    targetLanguage: z.string().min(2).max(8),
    /** Language for brief explanations (e.g. en) */
    supportLanguage: z.string().min(2).max(8).default("en"),
    level: z.enum(["beginner", "elementary"]).optional(),
    messages: z
        .array(
            z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string().min(1).max(2000),
            }),
        )
        .max(24),
    /** When true, ask the model to open the scene (no user message yet). */
    start: z.boolean().optional(),
});

const tutorSchema = {
    type: Type.OBJECT,
    properties: {
        reply: {
            type: Type.STRING,
            description:
                "Your next line in the target language (short, natural, one or two sentences).",
            nullable: false,
        },
        correction: {
            type: Type.STRING,
            description:
                "Optional: one gentle correction of the learner's last message, in the support language. Empty if none.",
            nullable: true,
        },
        betterPhrase: {
            type: Type.STRING,
            description:
                "Optional: a better version of what the learner tried, in the target language. Empty if none.",
            nullable: true,
        },
        continue: {
            type: Type.BOOLEAN,
            description: "False when the roleplay goal is complete or the scene should end.",
            nullable: false,
        },
        summaryHint: {
            type: Type.STRING,
            description:
                "When continue is false, one short tip for the learner in the support language; otherwise empty.",
            nullable: true,
        },
    },
    required: ["reply", "continue"],
};

const generationConfig: GenerationConfig = {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 512,
};

function langName(code: string) {
    const map: Record<string, string> = {
        en: "English",
        fr: "French",
        es: "Spanish",
        de: "German",
        it: "Italian",
        pt: "Portuguese",
        ht: "Haitian Creole",
    };
    return map[code.toLowerCase()] ?? code;
}

function buildSystemPrompt(input: {
    scenario: NonNullable<ReturnType<typeof getScenario>>;
    targetLanguage: string;
    supportLanguage: string;
    level: string;
}) {
    const { scenario, targetLanguage, supportLanguage, level } = input;
    const target = langName(targetLanguage);
    const support = langName(supportLanguage);

    return `You are Koze, a calm, patient conversation partner for language learners.

Scenario id: ${scenario.id}
Title: ${scenario.title}
Setting: ${scenario.setting}
Learner goal: ${scenario.goal}
Tags: ${scenario.tags.join(", ")}
Learner level: ${level}

Rules:
- Stay in character for the setting. Do not break the roleplay to lecture.
- Speak primarily in ${target}. Keep turns short (1–2 sentences).
- Match ${level} difficulty: simple vocabulary, clear structure, no dense grammar lectures.
- After the learner's message, you may offer at most ONE gentle correction in ${support} (field "correction").
- If you correct, also give a short "betterPhrase" in ${target} they could reuse.
- If the learner did well, leave correction and betterPhrase empty.
- Do not correct every tiny mistake — only what blocks meaning or is a clear level-appropriate target.
- When the learner has roughly achieved the goal, set continue to false and give a warm closing line in reply plus a brief summaryHint in ${support}.
- Never shame the learner. Tone is quiet, encouraging, unhurried.
- Do not invent long menus, prices, or plot twists. Keep the scene focused on the goal.

Respond ONLY with JSON matching the schema.`;
}

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json(
                { success: false, error: "Tutor is not configured." },
                { status: 500 },
            );
        }

        const json = await req.json();
        const parsed = bodySchema.safeParse(json);
        if (!parsed.success) {
            return NextResponse.json(
                { success: false, error: "Invalid request." },
                { status: 400 },
            );
        }

        const {
            scenarioId,
            targetLanguage,
            supportLanguage,
            messages,
            start,
            level: levelOpt,
        } = parsed.data;

        const scenario = getScenario(scenarioId);
        if (!scenario) {
            return NextResponse.json(
                { success: false, error: "Unknown scenario." },
                { status: 404 },
            );
        }

        const level = levelOpt ?? scenario.level;
        const system = buildSystemPrompt({
            scenario,
            targetLanguage,
            supportLanguage,
            level,
        });

        const historyText = messages
            .map((m) => `${m.role === "user" ? "Learner" : "Tutor"}: ${m.content}`)
            .join("\n");

        const userPrompt = start
            ? `Open the scene now. ${scenario.openingHint}\nRespond with your first tutor line only (no learner message yet).`
            : `Conversation so far:\n${historyText || "(just starting)"}\n\nContinue the roleplay. Respond to the learner's last message.`;

        const result = await genAi.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
                {
                    role: "user",
                    parts: [{ text: `${system}\n\n---\n\n${userPrompt}` }],
                },
            ],
            config: {
                ...generationConfig,
                responseMimeType: "application/json",
                responseSchema: tutorSchema,
            },
        });

        const responseText =
            result.candidates?.[0]?.content?.parts?.[0]?.text ??
            result.text ??
            "";

        let data: {
            reply?: string;
            correction?: string | null;
            betterPhrase?: string | null;
            continue?: boolean;
            summaryHint?: string | null;
        } = {};

        try {
            data = JSON.parse(responseText);
        } catch {
            return NextResponse.json(
                { success: false, error: "Tutor returned unusable text. Try again." },
                { status: 500 },
            );
        }

        const reply = String(data.reply ?? "").trim();
        if (!reply) {
            return NextResponse.json(
                { success: false, error: "Empty tutor reply. Try again." },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success: true,
            reply,
            correction: data.correction?.trim() || null,
            betterPhrase: data.betterPhrase?.trim() || null,
            continue: data.continue !== false,
            summaryHint: data.summaryHint?.trim() || null,
            scenario: {
                id: scenario.id,
                title: scenario.title,
                maxTurns: scenario.maxTurns,
            },
        });
    } catch (error) {
        console.error("tutor POST", error);
        return NextResponse.json(
            { success: false, error: "Something went wrong. Please try again." },
            { status: 500 },
        );
    }
}
