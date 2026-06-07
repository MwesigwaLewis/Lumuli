import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumuli Andrew | Youth Leader & Strategic Thinker",
  description: "Personal website of Lumuli Andrew - Youth leader, strategic thinker, and fashion enthusiast based in Uganda.",
  keywords: ["Lumuli Andrew", "Youth Leader", "Uganda", "Anglican Church", "Strategic Thinking", "Fashion"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
