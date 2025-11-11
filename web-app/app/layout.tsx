import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LI.FI Bridge Widget",
  description: "Cross-chain bridge powered by LI.FI",
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

