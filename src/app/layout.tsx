import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fynavo — Le cockpit financier intelligent des entreprises en croissance",
  description:
    "Fynavo centralise vos données financières, anticipe votre trésorerie, automatise vos reportings et vous aide à prendre de meilleures décisions.",
  icons: {
    icon: "/favicon.svg",
  },
};

import { GroupProvider } from "@/lib/group/GroupContext";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-blue-100 selection:text-blue-900">
        <LanguageProvider>
          <GroupProvider>{children}</GroupProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
