"use client";

import { LucideChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";

type Props = {};

const PageTopSection = (props: Props) => {
  const pathanme = usePathname();

  return (
    <div className="flex justify-between items-center py-2">
      <div className="h-[30px] w-[30px] flex items-center justify-center border rounded-full">
      <Link href="..">
        <LucideChevronLeft />
        </Link>
      </div>

      <div className="">
        {pathanme.slice(1, 2).toUpperCase() + pathanme.slice(2)}
      </div>
      <div className="w-[30px]"></div>
    </div>
  );
};

export default PageTopSection;
