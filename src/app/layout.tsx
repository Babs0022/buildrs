
import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Providers } from "./providers";
import '@coinbase/onchainkit/styles.css';
import { Toaster } from "@/components/ui/sonner";
import ClientOnly from "@/components/layout/ClientOnly";

const instrumentSans = Instrument_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BUILDRS",
  description: "You are what you build.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={instrumentSans.className}>
        <ClientOnly>
          <Providers>
            <Navbar />
            <main className="container mx-auto p-4">{children}</main>
            <Toaster />
          </Providers>
        </ClientOnly>
      </body>
    </html>
  );
}
