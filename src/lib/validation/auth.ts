import { z } from "zod";

// Rules mirror the Figma sign-up screen (03 / 03b).
// TODO(backend): confirm these match the .NET Identity password policy.
export const passwordRules = [
  { id: "length", label: "8+ characters", test: (v: string) => v.length >= 8 },
  { id: "number", label: "One number", test: (v: string) => /\d/.test(v) },
  { id: "case", label: "Upper & lowercase", test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
] as const;

const email = z.string().trim().toLowerCase().max(254).email("Enter a valid email, like name@email.com");

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(100, "That name is too long")
    .refine((v) => v.split(/\s+/).length >= 2, "Please enter your full name"),
  email,
  password: z
    .string()
    .max(128, "Password is too long")
    .refine((v) => passwordRules.every((r) => r.test(v)), "Password doesn't meet all the rules"),
  acceptTerms: z.literal(true, { error: "Please accept to continue" }),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const OTP_LENGTH = 6;

export const verifyEmailSchema = z.object({
  email,
  code: z.string().regex(new RegExp(`^\\d{${OTP_LENGTH}}$`), "Enter the 6-digit code"),
});
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export const emailOnlySchema = z.object({ email });
export type EmailOnlyInput = z.infer<typeof emailOnlySchema>;

export const loginSchema = z.object({
  email,
  // No strength rules on login: just require something, so old passwords still work.
  password: z.string().min(1, "Enter your password").max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;
