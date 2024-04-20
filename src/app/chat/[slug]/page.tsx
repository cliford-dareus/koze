"use client";

import { getData } from "@/_actions/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useCallback, useState } from "react";

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
  Question: string;
  wrong_answer: string[];
  correct_answer: string;
  image: string;
};

const initialQuestion = {
  Question: "",
  wrong_answer: [],
  correct_answer: "",
  image: "",
} as InitialType;

const Chat = ({ params }: Props) => {
  const [state, setState] = useState(initialQuestion);
  const [data, setData] = React.useState<ResponseType | null>(null);
  const [formData, setFormData] = React.useState<FormDataType>(initialFormData);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await getData(formData);
    setData(data);
  };

  const formatText = () => {
    if (!data) return;
    const inputs = data.text.split("\n");

    const newData = {
      Question: "",
      wrong_answer: [],
      correct_answer: "",
      image: "",
    } as {
      [key: string]: any;
    };

    for (const input of inputs) {
      const trimInput = input.trim();
      let identifier = trimInput.split(":")[0];

      if (identifier === "wrong_answer") {
        const wrongAnswersMatch = trimInput.match(/wrong_answer:\[(.*?)\]/);
        const wrongAnswers = wrongAnswersMatch
          ? wrongAnswersMatch[1].split(", ")
          : [];
        newData[identifier] = wrongAnswers;
      } else if (identifier === "image") {
        const url = trimInput.slice(trimInput.indexOf("image:") + 6)?.trim();
        newData[identifier] =
          url[url.length - 1] === "." ? url.slice(0, -1) : url;
      } else if (identifier === "correct_answer") {
        newData[identifier] = trimInput.split(":")[1].slice(0, -1)?.trim();
      } else {
        newData[identifier] = trimInput.split(":")[1]?.trim();
      }
    }

    setState((prev) => ({ ...prev, ...newData }));
  };

  const shuffle =useCallback( (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.sort(() => Math.random() - 0.5);
  }, [state]);

  React.useEffect(() => {
    formatText();
  }, [data]);

  return (
    <div className="h-full p-4">
      <div className="h-[40vh] relative bg-slate-200 rounded-lg">
        <img src={state.image} className="w-full h-full absolute inset-0" />
      </div>
      <div className="mt-4">
        <div className="min-h-[50px] bg-slate-200 rounded-lg">
          {state.Question}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {shuffle([...state.wrong_answer, state.correct_answer]).map(
            (item) => (
              <Button key={item}>{item}</Button>
            )
          )}
        </div>
        <form
          className="flex flex-col gap-4 mt-4"
          action=""
          onSubmit={handleChat}
        >
          <Input
            value={formData.prompt}
            onChange={(e) =>
              setFormData({ ...formData, prompt: e.target.value })
            }
          />
          <Button disabled={formData.prompt === ""} type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
