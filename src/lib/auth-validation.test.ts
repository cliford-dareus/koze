import { describe, expect, it } from "vitest";
import {
  credentialsSchema,
  parseCredentials,
  parseRegisterInput,
  registerSchema,
} from "@/lib/auth-validation";

describe("register validation", () => {
  it("accepts a valid email and password and lowercases the email", () => {
    const result = parseRegisterInput({
      name: "  Ada  ",
      email: "Ada@Example.com",
      password: "secret1",
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.email).toBe("ada@example.com");
    expect(result.data.name).toBe("Ada");
  });

  it("allows name to be omitted", () => {
    const result = parseRegisterInput({
      email: "learner@example.com",
      password: "secret1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a short password", () => {
    const result = parseRegisterInput({
      email: "learner@example.com",
      password: "12345",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      password: "secret1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an empty name after trim", () => {
    const result = registerSchema.safeParse({
      name: "   ",
      email: "learner@example.com",
      password: "secret1",
    });
    expect(result.success).toBe(false);
  });
});

describe("credentials validation", () => {
  it("accepts sign-in credentials and lowercases the email", () => {
    const result = parseCredentials({
      email: "User@Example.com",
      password: "secret1",
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.email).toBe("user@example.com");
  });

  it("rejects missing or short passwords", () => {
    expect(credentialsSchema.safeParse({ email: "a@b.co" }).success).toBe(false);
    expect(
      parseCredentials({ email: "a@b.co", password: "short" }).success,
    ).toBe(false);
  });
});
