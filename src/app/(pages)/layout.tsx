import React from "react";
import PageTopSection from "@/components/page-top-section";
import { Transcriber } from "@/components/providers/transcribe-provider";

type Props = {};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Transcriber>
      <section className="p-4 flex flex-col h-full gap-4">
        <PageTopSection />
        {children}
      </section>
    </Transcriber>
  );
}
