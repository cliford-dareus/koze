import Link from "next/link";
import React from "react";

type Props = {};

const AiChat = (props: Props) => {
  return (
    <div className="h-full flex flex-col p-4">
      <div className="bg-slate-200 px-4 py-2 rounded-lg">
        <Link href=".">Back</Link>
        <span>AI</span>
        <div className="">
          <h1 className="text-3xl font-bold">AI Chat</h1>
          <p className="font-medium">Have a conversation with an AI</p>
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
