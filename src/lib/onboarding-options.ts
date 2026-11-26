import type { familiarityValues, goalValues } from "@/lib/validation/auth";

// Copy from Figma screens 08, 09 and 10. Values map to the backend's wire strings (ADR 0023).

export const experienceOptions: {
  value: (typeof familiarityValues)[number];
  title: string;
  subtitle: string;
  points: [string, string];
  icon: "sprout" | "bars" | "trend";
}[] = [
  {
    value: "newcomer",
    title: "I'm completely new",
    subtitle: "Recommended starting point",
    points: ["I've never invested before", "I want to understand the basics"],
    icon: "sprout",
  },
  {
    value: "some",
    title: "I know a little",
    subtitle: "Some familiarity",
    points: ["I understand some investment concepts", "I'm ready to learn and explore"],
    icon: "bars",
  },
  {
    value: "experienced",
    title: "I'm experienced",
    subtitle: "Confident investor",
    points: ["I already understand investing", "I want better research tools"],
    icon: "trend",
  },
];

export const goalOptions: {
  value: (typeof goalValues)[number];
  label: string;
  icon: "book" | "trend" | "compass" | "building" | "pie" | "target";
}[] = [
  { value: "learn_investing", label: "Learn how investing works", icon: "book" },
  { value: "build_wealth", label: "Build long-term wealth", icon: "trend" },
  { value: "discover_opportunities", label: "Discover investment opportunities", icon: "compass" },
  { value: "research_companies", label: "Understand and research companies", icon: "building" },
  { value: "diversify", label: "Diversify my investments", icon: "pie" },
  { value: "practice_first", label: "Practice before investing real money", icon: "target" },
];

/**
 * Screen 10. Design is being revised from "currency" to "country" (confirmed by the lead).
 * country = ISO 3166 alpha-2 for PUT /compliance/country, currency = ISO 4217 for onboarding.
 * The Eurozone row has no single country, so it only sets the currency.
 * TODO(design): replace with the final country list when Figma is updated.
 */
export const countryOptions: {
  id: string;
  name: string;
  detail: string;
  country: string | null;
  currency: string;
  flag: string;
  keywords: string;
}[] = [
  { id: "ng", name: "Nigerian Naira", detail: "NGN · Nigeria", country: "NG", currency: "NGN", flag: "/flags/ng.svg", keywords: "nigeria naira ngn" },
  { id: "gb", name: "British Pound", detail: "GBP · United Kingdom", country: "GB", currency: "GBP", flag: "/flags/gb.svg", keywords: "united kingdom uk britain england pound sterling gbp" },
  { id: "eu", name: "Euro", detail: "EUR · Eurozone", country: null, currency: "EUR", flag: "/flags/eu.svg", keywords: "euro eurozone europe eur" },
  { id: "gh", name: "Ghanaian Cedi", detail: "GHS · Ghana", country: "GH", currency: "GHS", flag: "/flags/gh.svg", keywords: "ghana cedi ghs" },
  { id: "cn", name: "Chinese Yuan", detail: "CNY · China", country: "CN", currency: "CNY", flag: "/flags/cn.svg", keywords: "china chinese yuan renminbi cny rmb" },
];
