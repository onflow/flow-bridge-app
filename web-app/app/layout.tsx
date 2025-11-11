import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flow Foundation - Cross-chain bridge",
  description: "Flow Foundation - Cross-chain bridge",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/flow-logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/flow-logo.svg",
    apple: "/flow-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

