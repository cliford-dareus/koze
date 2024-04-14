import Link from "next/link";
import React from "react";

type Props = {};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className=" p-4 flex flex-col justify-between h-full pb-[15vh] gap-4">
      <div className="">
        <div className="flex gap-4">
          <Link href=".">{"<"} Back</Link>
        </div>
        <div className="mt-2 bg-slate-900 shadow p-4 rounded-lg">
          <h1 className="text-xl font-bold">AI</h1>
          <h1 className="text-3xl font-bold w-[80%]">
            Lets Learn something new
          </h1>
          <p className="mt-2 font-medium">
            Lorem ipsum, dolor sit amet consectetur.
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}
