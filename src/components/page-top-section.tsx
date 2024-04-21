"use client";
import { LucideChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

type Props = {};

const PageTopSection = (props: Props) => {
  const pathanme = usePathname();

  return (
    <div className="">
      <Link className="flex gap-2 items-center" href=".">
        <LucideChevronLeft size={20} />
        <p className="font-medium">Back</p>
      </Link>

      {pathanme === "/translation" ? (
        <div className="mt-2 bg-gradient-to-b from-indigo-500 to-blue-400 shadow-md p-4 rounded-lg text-white">
          <h1 className="font-bold">Word Of The Day</h1>
          <h1 className="text-3xl font-bold w-[80%]">
            Lets Learn something new
          </h1>
          <p className="mt-2 font-medium">
            Lorem ipsum, dolor sit amet consectetur.
          </p>
        </div>
      ) : pathanme === "/reading" ? (
        <div className="mt-2 bg-gradient-to-b from-indigo-500 to-blue-400 shadow p-4 rounded-lg text-white">
          <h1 className="font-bold">Word Of The Day</h1>
          <h1 className="text-3xl font-bold w-[80%]">
            Lets Learn something new
          </h1>
          <p className="mt-2 font-medium">
            Lorem ipsum, dolor sit amet consectetur.
          </p>
        </div>
      ) : pathanme === "/listening" ? (
        <div className="mt-2 bg-gradient-to-b from-indigo-500 to-blue-400 shadow p-4 rounded-lg text-white">
          <h1 className="font-bold">Word Of The Day</h1>
          <h1 className="text-3xl font-bold w-[80%]">
            Lets Learn something new
          </h1>
          <p className="mt-2 font-medium">
            Lorem ipsum, dolor sit amet consectetur.
          </p>
        </div>
      ) : (
        <div className="mt-2 bg-gradient-to-b from-indigo-500 to-blue-400 shadow p-4 rounded-lg text-white">
          <h1 className="font-bold">Word Of The Day</h1>
          <h1 className="text-3xl font-bold w-[80%]">
            Lets Learn something new
          </h1>
          <p className="mt-2 font-medium">
            Lorem ipsum, dolor sit amet consectetur.
          </p>
        </div>
      )}
    </div>
  );
};

export default PageTopSection;
