import React from "react";
import PageTopSection from "@/components/page-top-section";

type Props = {};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="p-4 flex flex-col h-full gap-4">
      <PageTopSection />
      {children}
    </section>
  );
}
