import { Input } from "@/components/ui/input";
import React from "react";

type Props = {};

const Translation = (props: Props) => {
  return (
    <div className="mt-auto h-[50vh]">
      <div className="flex flex-col items-center p-4 rounded-lg border border-slate-500 mt-auto h-full">
        <div className="h-[50px] flex gap-4 ">
          <p>English</p>
          <span>arrow</span>
          <p>French</p>
        </div>
        <div className="flex flex-col gap-4 mt-4 w-full">
          <Input />
          <Input />
        </div>
      </div>
    </div>
  );
};

export default Translation;
