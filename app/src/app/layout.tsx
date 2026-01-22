import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { GoogleAnalytics } from '@next/third-parties/google'

import { SubscriptionAlert } from "@/features/subscriptions/components/subscription-alert";

import { auth } from "@/auth";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { TranslationProvider } from "@/contexts/translation-context";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "ELYX",
  description: "Build Something Great!",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={`${inter.variable} ${playfair.variable} font-sans`} suppressHydrationWarning>
          <Providers>
            <TranslationProvider>
              <Toaster />
              <Modals />
              <SubscriptionAlert />
              {children}
            </TranslationProvider>
          </Providers>
          <GoogleAnalytics gaId="G-BM6K80M67T" />
        </body>
      </html>
    </SessionProvider>

  );
}
