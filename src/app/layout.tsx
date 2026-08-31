import type { Viewport, Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "../styles/globals.css";
import MainNavigation from "@/app/_components/main-navigation";
import { TooltipProvider } from "@/app/_components/ui/tooltip";
import AuthSessionProvider from "@/app/_components/providers/session-provider";
import AnimatedSplash from "@/app/_components/animated-splash";
import { Suspense } from "react";

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
                "splash_screens/iPhone_17_Pro__iPhone_17__iPhone_16_Pro_landscape.png",
                "screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png",
                "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_Air_landscape.png",
                "screen and (device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/10.9__iPad_Air_portrait.png",
                "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/10.2__iPad_portrait.png",
                "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png",
                "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png",
                "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png",
                "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png",
                "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/12.9__iPad_Pro_landscape.png",
                "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png",
                "screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png",
                "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/11__iPad_Pro_M4_landscape.png",
                "screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/13__iPad_Pro_M4_landscape.png",
                "screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png",
                "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/11__iPad_Pro_M4_portrait.png",
                "screen and (device-width: 834px) and (device-height: 1210px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png",
                "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png",
                "screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png",
                "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_11__iPhone_XR_landscape.png",
                "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png",
                "screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_17e__iPhone_16e__iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png",
                "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png",
                "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png",
                "screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/10.9__iPad_Air_landscape.png",
                "screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/12.9__iPad_Pro_portrait.png",
                "screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png",
                "screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_17e__iPhone_16e__iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png",
                "screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/10.2__iPad_landscape.png",
                "screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/10.5__iPad_Air_portrait.png",
                "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png",
                "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png",
                "screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_17_Pro_Max__iPhone_16_Pro_Max_portrait.png",
                "screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_11__iPhone_XR_portrait.png",
                "screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_16_Plus__iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png",
                "screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_17_Pro_Max__iPhone_16_Pro_Max_landscape.png",
                "screen and (device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/8.3__iPad_Mini_landscape.png",
                "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_Air_portrait.png",
                "screen and (device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/8.3__iPad_Mini_portrait.png",
                "screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/13__iPad_Pro_M4_portrait.png",
                "screen and (device-width: 1032px) and (device-height: 1376px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/10.5__iPad_Air_landscape.png",
                "screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
            ),
            splash(
                "splash_screens/iPhone_17_Pro__iPhone_17__iPhone_16_Pro_portrait.png",
                "screen and (device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png",
                "screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
            ),
            splash(
                "splash_screens/iPhone_16__iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png",
                "screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
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
                    <AnimatedSplash />
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
