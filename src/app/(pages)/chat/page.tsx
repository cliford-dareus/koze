import { LucideChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const AiChat = (props: Props) => {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="">
        <Link className="flex gap-2 items-center" href=".">
          <LucideChevronLeft size={20} />
          <p className="font-medium">Back</p>
        </Link>
        <div className="bg-slate-200 px-4 py-2 rounded-lg">
          <span>AI</span>
          <div className="">
            <h1 className="text-3xl font-bold">AI Chat</h1>
            <p className="font-medium">Have a conversation with an AI</p>
          </div>
        </div>
      </div>

      <div className="h-[40px]">
        <h1>header</h1>
      </div>
      <div className="flex-1">
        <div className="h-[50px] bg-slate-200 px-4 py-2 rounded-lg flex items-center">
          <Link href="/chat/supermarket">Supermarket</Link>
        </div>
      </div>
    </div>
  );
};

export default AiChat;
