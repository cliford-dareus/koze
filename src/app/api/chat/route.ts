import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import animals from "@/data/images.json";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt: string = body.prompt ?? body.instruction ?? "Start";
    const category: string = (body.category ?? "animals").replace(/-/g, " ");

    const model = genAi.getGenerativeModel({
      model: "gemini-1.5-pro-latest",
      systemInstruction: {
        role: "user",
        parts: [
          {
            text: `
You are a patient language teacher writing a short multiple-choice quiz.
Topic: ${category}.

Rules:
- Ask exactly ONE clear question suitable for a beginner/intermediate learner.
- Provide exactly 3 wrong answers and 1 correct answer.
- Prefer concrete, distinct options (not tiny wording tricks).
- If the topic relates to animals, you may pick an image URL from the JSON list below.
- For other topics, set image: (leave empty or omit a real URL).

Respond in this exact format (one field per line):
Question: <your question>
wrong_answer:[wrong 1, wrong 2, wrong 3]
correct_answer: <the correct answer>
image: <url or empty>

Animal images JSON (optional):
${JSON.stringify(animals)}
            `.trim(),
          },
        ],
      },
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello!" }],
        },
        {
          role: "model",
          parts: [{ text: "Ready for a quiz question." }],
        },
      ],
    });

    const result = await chat.sendMessage(
      `${prompt}\n\nTopic: ${category}. Return one quiz item in the required format.`,
    );
    const text = result.response.text();

    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, text: "" },
      { status: 500 },
    );
  }
}
