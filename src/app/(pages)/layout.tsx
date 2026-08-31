import React from "react";
import PageTopSection from "@/app/_components/page-top-section";
import { Transcriber } from "@/app/_components/providers/transcribe-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <Transcriber>
            <section className="app-shell-nested">
                <PageTopSection />
                <div className="min-h-0 flex-1">{children}</div>
            </section>
        </Transcriber>
    );
}
