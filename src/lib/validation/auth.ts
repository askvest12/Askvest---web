import { z } from "zod";

// Rules match the backend's PasswordPolicy (askvest12/AskVest): 10 to 128 chars,
// at least one letter and one number. The backend also rejects common/breached
// passwords; that error comes back from the API and shows under the field.
export const PASSWORD_MIN = 10;
export const passwordRules = [
  { id: "length", label: `${PASSWORD_MIN}+ characters`, test: (v: string) => v.length >= PASSWORD_MIN },
  { id: "letter", label: "One letter", test: (v: string) => /\p{L}/u.test(v) },
  { id: "number", label: "One number", test: (v: string) => /\d/.test(v) },
] as const;

/** Backend rule: the password can't contain the part of the email before "@" (3+ chars). */
export function containsEmailName(password: string, email: string) {
  const local = email.split("@")[0]?.trim().toLowerCase() ?? "";
  return local.length >= 3 && password.toLowerCase().includes(local);
}

const email = z.string().trim().toLowerCase().max(254).email("Enter a valid email, like name@email.com");

export const signUpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(120, "That name is too long")
    .refine((v) => v.split(/\s+/).length >= 2, "Please enter your full name"),
  email,
  password: z
    .string()
    .max(128, "Password is too long")
    .refine((v) => passwordRules.every((r) => r.test(v)), "Password doesn't meet all the rules"),
  acceptTerms: z.literal(true, { error: "Please accept to continue" }),
}).superRefine((v, ctx) => {
  if (containsEmailName(v.password, v.email)) {
    ctx.addIssue({ code: "custom", path: ["password"], message: "Password can't contain your email name" });
  }
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

// Onboarding (ADR 0023 in askvest12/AskVest): PUT /api/v1/account/onboarding + PUT /api/v1/compliance/country
export const familiarityValues = ["newcomer", "some", "experienced"] as const;
export const goalValues = [
  "learn_investing",
  "build_wealth",
  "discover_opportunities",
  "research_companies",
  "diversify",
  "practice_first",
] as const;

export const onboardingSchema = z
  .object({
    familiarity: z.enum(familiarityValues).optional(),
    goals: z.array(z.enum(goalValues)).max(goalValues.length).optional(),
    preferredCurrency: z.string().regex(/^[A-Z]{3}$/).optional(),
    country: z.string().regex(/^[A-Z]{2}$/).optional(),
  })
  .refine((v) => Object.values(v).some((x) => x !== undefined), "Nothing to save");
export type OnboardingInput = z.infer<typeof onboardingSchema>;
