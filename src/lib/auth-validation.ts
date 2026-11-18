import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(128),
});

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type CredentialsInput = z.infer<typeof credentialsSchema>;

export function parseRegisterInput(raw: unknown) {
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return parsed;
  return {
    success: true as const,
    data: {
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
    },
  };
}

export function parseCredentials(raw: unknown) {
  const parsed = credentialsSchema.safeParse(raw);
  if (!parsed.success) return parsed;
  return {
    success: true as const,
    data: {
      ...parsed.data,
      email: parsed.data.email.toLowerCase(),
    },
  };
}
