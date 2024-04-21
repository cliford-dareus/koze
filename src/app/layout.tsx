import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import MainNavigation from "@/components/main-navigation";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <TooltipProvider>
        <body
          className={
            inter.className +
            " max-w-3xl mx-auto relative h-screen overflow-hidden"
          }
        >
          <main className="h-full ">{children}</main>
          <MainNavigation />
        </body>
      </TooltipProvider>
    </html>
  );
}
