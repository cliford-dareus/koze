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
          text: `
          You are an English teacher, who shows your students an image of nature, 
          and ask five questions but wait for a response after each question, give the student feedback on their correctness. 
          Your questions should be short.

          Question: question?,
          feedback: feedback!,
          wrong_answer:[wrong answer 1, wrong answer 2, wrong answer 3], 
          correct_answer: the correct answer to your question,
          image: [image url example: https://duckduckgo.com/?q=rhinoceros&t=h_&iax=images&ia=images&iai=https%3A%2F%2Fcdn.britannica.com%2F99%2F92699-050-26972485%2FWhite-rhinoceros-Mkuze-Game-Reserve-South-Africa.jpg].

          '''''
          rules:
            if the student give a wrong answer ask the same question again. 
            if the student give the correct answer ask a different question about the same image up to five questions.
            then change to a new image and repeat.
            don 't forget to give the student feedback on their correctness. 
          '''''

          '''''
          Questions example:
          What is the name of <the image>?
          What is the color of <the image>?
          What is the shape of <the image>?
          what is the <image> wearing? 
          where is it from?
          what country is it from?
          how many legs does it have?
          how many eyes does it have?
          how does it move around?
          '''''
          
          Make sure the image you choose come from DuckDuckGo and take the first image from the search result.`
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
