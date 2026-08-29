import {
  GoogleGenerativeAI,
  SchemaType,
  type Content,
  type GenerationConfig,
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import animals from "@/data/images.json";
import {
  parseQuizJson,
  type QuizHistoryItem,
  type QuizItem,
  type QuizResponse,
} from "@/lib/quiz";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const quizSchema = {
  type: SchemaType.OBJECT,
  description: "One language-learning multiple-choice quiz item",
  properties: {
    question: {
      type: SchemaType.STRING,
      description: "A single clear question for a beginner or intermediate learner",
      nullable: false,
    },
    choices: {
      type: SchemaType.ARRAY,
      description: "Exactly four distinct answer choices",
      items: { type: SchemaType.STRING },
    },
    correctIndex: {
      type: SchemaType.INTEGER,
      description: "0-based index of the correct choice (0-3)",
      nullable: false,
    },
    imageUrl: {
      type: SchemaType.STRING,
      description:
        "Optional image URL copied exactly from the provided catalog, or an empty string",
      nullable: true,
    },
    explanation: {
      type: SchemaType.STRING,
      description: "One short sentence explaining why the correct answer is right",
      nullable: false,
    },
  },
  required: ["question", "choices", "correctIndex", "explanation"],
};

const generationConfig: GenerationConfig = {
  temperature: 0.85,
  topP: 0.9,
  maxOutputTokens: 512,
  responseMimeType: "application/json",
  responseSchema: quizSchema as GenerationConfig["responseSchema"],
};

function catalogFor(category: string) {
  const key = category.toLowerCase();
  const data = animals as Record<string, { url: string; description: string }[]>;
  if (key.includes("animal")) return data.animals ?? [];
  return [];
}

function systemPrompt(category: string) {
  const catalog = catalogFor(category);
  const imageRule =
    catalog.length > 0
      ? `When an image helps, copy imageUrl EXACTLY from this catalog (or use ""):
${JSON.stringify(catalog, null, 0)}`
      : `Set imageUrl to an empty string. Do not invent URLs.`;

  return `You are Koze, a calm language teacher writing a short multiple-choice quiz.

Topic: ${category}
Audience: beginner to intermediate language learners.

Write exactly ONE new question per response.

Rules:
- Question must be concrete, specific, and answerable from general knowledge of the topic.
- Provide exactly 4 choices. One is correct. The other three are plausible but clearly wrong.
- Do not use tiny wording tricks, "all of the above", or overlapping answers.
- correctIndex is the 0-based index of the correct choice.
- Keep the question under 140 characters. Keep each choice under 80 characters.
- explanation: one sentence, no spoilers in the question text itself.
- Never repeat a question that already appeared in this conversation.
- ${imageRule}

Return only JSON that matches the schema. No markdown.`;
}

function userTurn(
  category: string,
  history: QuizHistoryItem[],
  isFollowUp: boolean,
) {
  const asked = history.map((h) => h.question).filter(Boolean);
  const last = history[history.length - 1];

  const avoid =
    asked.length > 0
      ? `Do NOT repeat or rephrase any of these previous questions:\n- ${asked.join("\n- ")}`
      : "This is the first question in the session.";

  let lastResult = "";
  if (last && last.chosenIndex != null) {
    const picked = last.choices[last.chosenIndex] ?? "(no choice)";
    const right = last.choices[last.correctIndex] ?? "";
    const ok = last.chosenIndex === last.correctIndex;
    lastResult = `The learner just answered "${picked}" which was ${ok ? "correct" : `incorrect (right answer: "${right}")`}.`;
  }

  return [
    isFollowUp
      ? `Ask the NEXT quiz question about "${category}". Make it different in subject from the last one.`
      : `Start a quiz about "${category}". Ask the first question.`,
    lastResult,
    avoid,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function toModelJson(item: QuizHistoryItem): QuizItem {
  return {
    question: item.question,
    choices: item.choices,
    correctIndex: item.correctIndex,
    imageUrl: item.imageUrl ?? "",
    explanation: item.explanation ?? "",
  };
}

/** Gemini JSON mode requires model history turns to be valid schema JSON. */
function buildGeminiHistory(
  category: string,
  history: QuizHistoryItem[],
): Content[] {
  const contents: Content[] = [];
  history.forEach((item, index) => {
    contents.push({
      role: "user",
      parts: [{ text: userTurn(category, history.slice(0, index), index > 0) }],
    });
    contents.push({
      role: "model",
      parts: [{ text: JSON.stringify(toModelJson(item)) }],
    });
  });
  return contents;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Quiz is not configured." } satisfies QuizResponse,
        { status: 500 },
      );
    }

    const body = await request.json();
    const category: string = String(body.category ?? "animals")
      .replace(/-/g, " ")
      .trim() || "animals";
    const history: QuizHistoryItem[] = Array.isArray(body.history)
      ? body.history.slice(-6)
      : [];

    const model = genAi.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt(category),
      generationConfig,
    });

    const chat = model.startChat({
      history: buildGeminiHistory(category, history),
    });

    const result = await chat.sendMessage(
      userTurn(category, history, history.length > 0),
    );
    const raw = result.response.text();
    const quiz = parseQuizJson(raw);

    if (!quiz) {
      return NextResponse.json(
        {
          success: false,
          error: "The tutor returned an unusable question. Try again.",