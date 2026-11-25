import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Providers } from "./providers";
import "./globals.css";

// Plus Jakarta Sans (SIL Open Font License), self-hosted variable font, weights 200-800.
const jakarta = localFont({
  src: "../fonts/PlusJakartaSans-Variable.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "AskVest", template: "%s · AskVest" },
  description: "Think smarter. Invest confidently.",
  applicationName: "AskVest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#03193d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full bg-surface">
        <Providers>
          {/* App shell: full-width on phones, phone-width column on bigger screens */}
          <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-white shadow-[0_0_40px_rgba(3,25,61,0.06)]">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
