import type { Viewport, Metadata } from "next";
import { Inter, Poppins} from "next/font/google";
import "../styles/globals.css";
import MainNavigation from "@/app/_components/main-navigation";
import { TooltipProvider } from "@/app/_components/ui/tooltip";

const poppins = Poppins({ weight: ['500', '600', '700', '800', '900'], subsets: ['latin'] });

export const metadata: Metadata = {
  title: "TiKoze",
  description: "TiKoze is a language learning app for beginners and experts",
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon-196.png",
    apple: [{ url: "/apple-icon-180.png" }],
  },
  appleWebApp: {
    title: "TiKoze",
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "apple-splash-2048-2732.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "apple-splash-2732-2048.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "apple-splash-1668-2388.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "apple-splash-2388-1668.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "apple-splash-1536-2048.jpg",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "apple-splash-2048-1536.jpg",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "apple-splash-1488-2266.jpg",
        media:
          "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "apple-splash-2266-1488.jpg",
        media:
          "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "apple-splash-1640-2360.jpg",
        media:
          "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "apple-splash-2360-1640.jpg",
        media:
          "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "apple-splash-1668-2224.jpg",
        media:
          "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "apple-splash-2224-1668.jpg",
        media:
          "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "apple-splash-1620-2160.jpg",
        media:
          "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },

      {
        url: "apple-splash-2160-1620.jpg",
        media:
          "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "apple-splash-1290-2796.jpg",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait),",
      },
      {
        url: "apple-splash-2796-1290.jpg",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape),",
      },
      {
        url: "apple-splash-1179-2556.jpg",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait),",
      },
      {
        url: "apple-splash-2556-1179.jpg",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape),",
      },
      {
        url: "apple-splash-1284-2778.jpg",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait),",
      },
      {
        url: "apple-splash-2778-1284.jpg",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape),",
      },
      {
        url: "apple-splash-1170-2532.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait),",
      },
      {
        url: "apple-splash-2532-1170.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape),",
      },
      {
        url: "apple-splash-1125-2436.jpg",
        media:
          "(device:width 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait),",
      },
      {
        url: "apple-splash-2436-1125.jpg",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape),",
      },
      {
        url: "apple-splash-1242-2688.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait),",
      },
      {
        url: "apple-splash-2688-1242.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape),",
      },
      {
        url: "apple-splash-828-1792.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait),",
      },
      {
        url: "apple-splash-1792-828.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape),",
      },
      {
        url: "apple-splash-1242-2208.jpg",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait),",
      },
      {
        url: "apple-splash-2208-1242.jpg",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape),",
      },
      {
        url: "apple-splash-750-1334.jpg",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait),",
      },
      {
        url: "apple-splash-1334-750.jpg",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape),",
      },
      {
        url: "apple-splash-640-1136.jpg",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait),",
      },
      {
        url: "apple-splash-1136-640.jpg",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape),",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximumScale: 1,
  userScalable: false,
  viewportFit: "contain",
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
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
            poppins.className +
            " h-screen overflow-hidden"
          }
        >
          <div className="max-w-3xl mx-auto h-full relative">
            <main className="h-full ">{children}</main>
            <MainNavigation />
          </div>
        </body>
      </TooltipProvider>
    </html>
  );
}
