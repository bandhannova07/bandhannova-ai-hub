import type { Metadata } from "next";
import { Inter, Outfit, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BandhanNova - Where AI Doesn't Just Answer, You Grow",
  description: "India's first next-generation AI life-growing platform designed for the Gen-Z era. Multi-brain AI system for learning, creativity, psychology, career building, and personal growth.",
  keywords: ["AI platform", "Indian AI", "Gen-Z", "personal growth", "AI learning", "career building", "multi-language AI"],
  authors: [{ name: "BandhanNova" }],
  openGraph: {
    title: "BandhanNova - Where AI Doesn't Just Answer, You Grow",
    description: "India's first next-generation AI life-growing platform for Gen-Z",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} ${spaceGrotesk.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
