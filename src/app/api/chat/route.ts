import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAi = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? "");

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


          Choose image from this list: 
          [
            {
              url: https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg, 
              description: Green Perched Parakeet sitting on a branch
            },
            {
              url: https://images.pexels.com/photos/67552/giraffe-tall-mammal-africa-67552.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1, 
              description: A Brown Giraffe from Africa Walking on Brown Grass, it is very tall 
            },
            {
              url: https://images.pexels.com/photos/162140/duckling-birds-yellow-fluffy-162140.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1,
              description: Duckling with yellow fllufy feathers on Black Soil during Daytime
            },
            {
              url: https://images.pexels.com/photos/17811/pexels-photo.jpg,
              description: Black and Green Toucan on Tree Branch
            },
            {
              url: https://images.pexels.com/photos/219906/pexels-photo-219906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1,
              description: A Brown Deer Near Withered Tree with a blue bird sitting on its horn.
            },
            {
              url: https://images.pexels.com/photos/162203/panthera-tigris-altaica-tiger-siberian-amurtiger-162203.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1,
              description: Tiger Standing on the Grey Concrete Pavement
            },
            {
              url: https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1,
              description:  an Adult Black Pug
            },
            {
              url: https://images.pexels.com/photos/3551498/pexels-photo-3551498.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1, 
              description: Two Gray Elephants on the forest. 
            },
            {
              url: https://images.pexels.com/photos/460961/pexels-photo-460961.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1,
              description:  Brown and Black Bee on Yellow Flower
            },
            {
              url: https://images.pexels.com/photos/750539/pexels-photo-750539.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1,
              description:  Zebras Standing on an Open Field
            },
            {
              url: https://images.pexels.com/photos/36762/scarlet-honeyeater-bird-red-feathers.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1,
              description: Red and Black feathers Bird, called scarlet Honeyeater standing on Red Flowers.
            },
            {
              url: https://images.pexels.com/photos/1575857/pexels-photo-1575857.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1,
              description: Brown Llama Standing on outside in the snow
            },
          ]
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
