import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Krishnanunni | Full-stack Developer",
  description: "Krishnanunni, full-stack developer and Team Lead at chargeMOD. Small explanations of connected systems, a ThinkPad homelab, and things I’m learning.",
  keywords: ['Krishnanunni', 'Krishnanunni developer', 'Krishnanunni Kerala', 'krishnanunni.in', 'Software Engineer Kerala'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <a className="skipLink" href="#main-content">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
