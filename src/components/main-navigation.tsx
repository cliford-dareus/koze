import { LucideBadgeInfo, LucideBrainCircuit, LucideHome, LucideLanguages } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

const MainNavigation = (props: Props) => {
  return (
    <nav className="absolute bottom-4 left-4 right-4 border border-slate-200 rounded-full py-2 flex items-center px-4 shadow-md">
      <ul className="w-full flex gap-4 justify-between">
        <li>
          <Link className="flex flex-col items-center" href="/">
            <LucideHome size={18} />
            <p className="font-medium">HOME</p>
          </Link>
        </li>

        <li>
          <Link className="flex flex-col items-center" href="/translation">
            <LucideLanguages size={18} />
            <p className="font-medium">TRANSLATE</p>
          </Link>
        </li>

        <li>
          <Link className="flex flex-col items-center" href="/chat">
            <LucideBrainCircuit size={18} />
            <p className="font-medium">AI QUIZ</p>
          </Link>
        </li>

        <li>
          <Link className="flex flex-col items-center" href="/about">
            <LucideBadgeInfo size={18} />
            <p className="font-medium">ABOUT</p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavigation;
