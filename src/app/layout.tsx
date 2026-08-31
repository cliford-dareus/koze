import type { Viewport, Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "../styles/globals.css";
import MainNavigation from "@/app/_components/main-navigation";
import { TooltipProvider } from "@/app/_components/ui/tooltip";
import AuthSessionProvider from "@/app/_components/providers/session-provider";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600"],
});

/** Absolute paths so iOS resolves splash assets from the site root. */
const splash = (file: string, media: string) => ({
  url: `/${file}`,
  media,
});

export const metadata: Metadata = {
  applicationName: "Koze",
  title: {
    default: "Koze",
    template: "%s · Koze",
  },
  description:
    "Koze is a calm language studio for translation, reading, listening, and conversation.",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon-196.png",
    apple: [{ url: "/apple-icon-180.png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Koze",
    statusBarStyle: "default",
    startupImage: [
      splash(
        "apple-splash-2048-2732.jpg",
        "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2732-2048.jpg",
        "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1668-2388.jpg",
        "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2388-1668.jpg",
        "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1536-2048.jpg",
        "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2048-1536.jpg",
        "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1488-2266.jpg",
        "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2266-1488.jpg",
        "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1640-2360.jpg",
        "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2360-1640.jpg",
        "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1668-2224.jpg",
        "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2224-1668.jpg",
        "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1620-2160.jpg",
        "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2160-1620.jpg",
        "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1290-2796.jpg",
        "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2796-1290.jpg",
        "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1179-2556.jpg",
        "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2556-1179.jpg",
        "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1284-2778.jpg",
        "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2778-1284.jpg",
        "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1170-2532.jpg",
        "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2532-1170.jpg",
        "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1125-2436.jpg",
        "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2436-1125.jpg",
        "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1242-2688.jpg",
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2688-1242.jpg",
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-828-1792.jpg",
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-1792-828.jpg",
        "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-1242-2208.jpg",
        "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-2208-1242.jpg",
        "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-750-1334.jpg",
        "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-1334-750.jpg",
        "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
      splash(
        "apple-splash-640-1136.jpg",
        "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      ),
      splash(
        "apple-splash-1136-640.jpg",
        "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      ),
    ],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#F4F1EB",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <body
        className={`${outfit.className} h-[100dvh] overflow-hidden paper-grain`}
      >
        <AuthSessionProvider>
          <TooltipProvider>
            <div className="app-frame">
              <main className="h-full overflow-y-auto overscroll-y-contain">
                {children}
              </main>
              <MainNavigation />
            </div>
          </TooltipProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
