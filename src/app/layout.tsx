import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white`}>
        <nav className="p-4 flex justify-between items-center border-b border-gray-800">
          <Link href="/" className="text-2xl font-bold">BUILDRS</Link>
          <div className="flex space-x-4">
            <Link href="/feed">Feed</Link>
            <Link href="/leaderboard">Leaderboard</Link>
            <Link href="/profile">Profile</Link>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}