import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const authPages = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

  const isAuthPage = authPages.some((p) => pathname.startsWith(p));
  const isOnboarding = pathname.startsWith("/onboarding");

  // Signed-in users leave auth pages
  if (token && isAuthPage) {
    const dest = token.onboardingCompleted ? "/" : "/onboarding";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // Onboarding requires a session
  if (isOnboarding && !token) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", "/onboarding");
    return NextResponse.redirect(login);
  }

  // Force onboarding once for signed-in users who have not finished it
  if (
    token &&
    !token.onboardingCompleted &&
    !isOnboarding &&
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/onboarding",
    "/onboarding/:path*",
    "/",
    "/translation",
    "/translation/:path*",
    "/reading",
    "/reading/:path*",
    "/listening",
    "/listening/:path*",
    "/chat",
    "/chat/:path*",
    "/lessons",
    "/lessons/:path*",
    "/profile",
    "/profile/:path*",
  ],
};
