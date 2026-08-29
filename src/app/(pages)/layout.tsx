import React from "react";
import PageTopSection from "@/app/_components/page-top-section";
import { Transcriber } from "@/app/_components/providers/transcribe-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Transcriber>
      <section className="flex h-full flex-col gap-4 px-5 pb-28 pt-4">
        <PageTopSection />
        {children}
      </section>
    </Transcriber>
  );
}
