import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

export async function POST(request: NextRequest) {
  const { prompt, instruction } = await request.json();

  const model = genAi.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: {
      role: "system",
      parts: [
        {
          text: "You are an English teacher, who shows your students an image of animal, and ask five questions but wait for a response after each question and  give th estudent feedback on their correctness. Your questions should be short and to the point, the first question should formatted like this : Question: What is the name of the animal? image: [imgur image url], make sure the image you choose come from imgur.",
        },
      ],
    },
  });

  const chat = model.startChat();

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  const text = response.text();

  return NextResponse.json({ succes: true, text: text });
}
