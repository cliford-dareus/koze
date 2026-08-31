import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const providers = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(raw) {
      const parsed = credentialsSchema.safeParse(raw);
      if (!parsed.success) return null;

      await connectDB();
      const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).select(
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
          name: user.name,
          image: user.image,
          emailVerified: new Date(),
          onboarding: { completed: false },
        });
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.onboardingCompleted = user.onboardingCompleted ?? false;
        token.learningLanguage = user.learningLanguage;
        token.nativeLanguage = user.nativeLanguage;
      }

      // Refresh profile flags from DB when needed
      if (token.email && (trigger === "update" || token.onboardingCompleted === undefined)) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: String(token.email).toLowerCase() });
          if (dbUser) {
            token.id = String(dbUser._id);
            token.onboardingCompleted = Boolean(dbUser.onboarding?.completed);
            token.learningLanguage = dbUser.onboarding?.learningLanguage;
            token.nativeLanguage = dbUser.onboarding?.nativeLanguage;
            token.name = dbUser.name ?? dbUser.onboarding?.displayName ?? token.name;
          }
        } catch {
          // keep existing token on transient DB errors
        }
      }

      if (trigger === "update" && session) {
        if (typeof session.onboardingCompleted === "boolean") {
          token.onboardingCompleted = session.onboardingCompleted;
        }
        if (session.learningLanguage) token.learningLanguage = session.learningLanguage;
        if (session.nativeLanguage) token.nativeLanguage = session.nativeLanguage;
        if (session.name) token.name = session.name;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.onboardingCompleted = Boolean(token.onboardingCompleted);
        session.user.learningLanguage = token.learningLanguage;
        session.user.nativeLanguage = token.nativeLanguage;
      }
      return session;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
});
