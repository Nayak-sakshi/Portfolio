import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const serif = Fraunces({ subsets: ["latin"], variable: "--font-serif", axes: ["opsz", "SOFT"], style: ["normal", "italic"] });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Sakshi Nayak — Backend Developer",
  description:
    "Backend developer building Node.js microservices, Kafka event pipelines and fast, reliable APIs.",
  openGraph: {
    title: "Sakshi Nayak — Backend Developer",
    description: "Node.js · Microservices · Kafka · Distributed Systems",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0b0b0e" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
