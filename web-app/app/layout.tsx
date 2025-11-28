import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flow Foundation - Cross-chain bridge",
  description: "Flow Foundation - Cross-chain bridge",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  other: {
    'color-scheme': 'light dark',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}

