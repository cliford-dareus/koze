import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import animals  from "@/data/images.json";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  const { prompt, instruction } = await request.json();

  const model = genAi.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: {
      role: "Teacher",
      parts: [
        {
          text: `
            You are an English teacher. Give your students a quiz about animals.
            Choose one of the image from the list based on it's description ask simple, distinct and interesting questions about it.
            Ask a one question and wait for the student to answer then ask another. 
            After one or two questions about an image choose a different image to ask questions about.

            Example:
            Question: question?,
            wrong_answer:[wrong answer 1, wrong answer 2, wrong answer 3], 
            correct_answer: the correct answer to your question,
            image: image url example: https://duckduckgo.com/?q=rhinoceros&t=h_&iax=images&ia=images&iai=https%3A%2F%2Fcdn.britannica.com%2F99%2F92699-050-26972485%2FWhite-rhinoceros-Mkuze-Game-Reserve-South-Africa.jpg.

            Choose image from this JSON Object: 
            ${JSON.stringify(animals)}
          `,
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
        parts: [{ text: "Good morning! Let's start with quiz" }],
      },
    ],
  });

  const result = await chat.sendMessage(prompt);
  const response = result.response;
  const text = response.text();

  return NextResponse.json({ succes: true, text: text });
}
