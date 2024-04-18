"use client";

import { getData } from "@/_actions/chat";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";

type Props = {
  params: {
    slug: string;
  };
};

export type FormDataType = {
  prompt: string;
  category: string;
};

export const initialFormData = {
  prompt: "",
  category: "",
} as FormDataType;

type ResponseType = {
  text: string;
  success: boolean;
};

type InitialType = {
  question: string;
  feedback: string;
  wrongAnswer: string[];
  correctAnswer: string;
  image: string;
};

const initialQuestion = {
  question: "",
  feedback: "",
  wrongAnswer: [],
  correctAnswer: "",
  image: "",
} as InitialType;

const Chat = ({ params }: Props) => {
  const [state, setState] = useState(initialQuestion);
  const [data, setData] = React.useState<ResponseType | null>(null);
  const [imageUrl, setImageUrl] = React.useState("");
  const [formData, setFormData] = React.useState<FormDataType>(initialFormData);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await getData(formData);
    console.log(data);
    setData(data);
  };

  const formatText = () => {
    if (!data) return;
    const iFeedback = data.text.indexOf("feedback:");
    const iQuestion = data.text.indexOf("Question:"); 
    const iImage = data.text.indexOf("image:");
    const iWrongAnswer = data.text.indexOf("wrong_answer:");
    const iCorrectAnswer = data.text.indexOf("correct_answer:");

    const question = data?.text?.slice(iQuestion, iFeedback).trim();
    const feedback = data?.text?.slice(iFeedback, iWrongAnswer).trim();
    const wrongAnswer = data?.text?.slice(iWrongAnswer, iCorrectAnswer).trim().split(',');
    const correctAnswer = data?.text?.slice(iCorrectAnswer, iImage).trim();
    const image = data?.text?.split("image:")[1].trim()

    const newData = {
      question,
      feedback,
      wrongAnswer,
      correctAnswer,
      image,
    } as InitialType;

    setState((prev) => ({ ...prev, ...newData }));
  };

  React.useEffect(() => {
    formatText();
  }, [data]);

  return (
    <div className="h-full p-4">
      <div className="h-[50vh] bg-slate-200 rounded-lg">{/* <Image /> */}
        <img src={state.image} />
      </div>
      <div className="mt-4">
        <div className="min-h-[50px] bg-slate-200 rounded-lg">
          {state.feedback}
          {state.question}
          {state.wrongAnswer}
          {state.correctAnswer}
        </div>
        <form action="" onSubmit={handleChat}>
          <Input
            value={formData.prompt}
            onChange={(e) =>
              setFormData({ ...formData, prompt: e.target.value })
            }
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
