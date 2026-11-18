import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { parseCredentials } from "@/lib/auth-validation";

const providers = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const parsed = parseCredentials(raw);
      if (!parsed.success) return null;

      await connectDB();
      const user = await User.findOne({ email: parsed.data.email }).select(
        "+passwordHash name email image onboarding",
      );

      if (!user?.passwordHash) return null;

      const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
      if (!valid) return null;

      return {
        id: String(user._id),
        email: user.email,
        name: user.name ?? user.onboarding?.displayName ?? user.email,
        image: user.image ?? undefined,
        onboardingCompleted: Boolean(user.onboarding?.completed),
        learningLanguage: user.onboarding?.learningLanguage,
        nativeLanguage: user.onboarding?.nativeLanguage,
      };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }) as never,
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;

      await connectDB();
      const existing = await User.findOne({ email: user.email.toLowerCase() });
      if (!existing) {
        await User.create({
          email: user.email.toLowerCase(),
          name: user.name || user.email.split("@")[0],
          image: user.image,
          onboarding: { completed: false },
          progress: {},
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.onboardingCompleted = user.onboardingCompleted;
        token.learningLanguage = user.learningLanguage;
        token.nativeLanguage = user.nativeLanguage;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
        session.user.learningLanguage = token.learningLanguage as string | undefined;
        session.user.nativeLanguage = token.nativeLanguage as string | undefined;
      }
      return session;
    },
  },
});
