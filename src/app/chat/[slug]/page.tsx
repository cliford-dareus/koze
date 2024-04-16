"use client";

import { getData } from "@/_actions/chat";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React from "react";

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

const Chat = ({ params }: Props) => {
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

    const url = data?.text?.split("image:")[1];
    console.log(url);
  };

  React.useEffect(() => {
    formatText();
  }, [data]);

  return (
    <div className="h-full p-4">
      <div className="h-[50vh] bg-slate-200 rounded-lg">{/* <Image /> */}</div>
      <div className="mt-4">
        <div className="min-h-[50px] bg-slate-200 rounded-lg">
          {data?.text.split("\n\n")[0]}
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
