import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Riveo Health — Healthcare AI Revenue & Interaction OS",
  description:
    "AI-native platform that controls patient interactions, revenue cycle, and financial flow. The operating system for healthcare revenue.",
  keywords: [
    "healthcare AI",
    "revenue cycle management",
    "RCM",
    "medical billing",
    "claims management",
    "healthcare payments",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
