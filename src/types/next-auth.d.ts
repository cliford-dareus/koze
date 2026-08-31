import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      onboardingCompleted: boolean;
      learningLanguage?: string;
      nativeLanguage?: string;
    } & DefaultSession["user"];
  }

  interface User {
    onboardingCompleted?: boolean;
    learningLanguage?: string;
    nativeLanguage?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    onboardingCompleted?: boolean;
    learningLanguage?: string;
    nativeLanguage?: string;
  }
}
