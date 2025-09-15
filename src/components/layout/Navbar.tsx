
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import ClientOnlyWallet from "./ClientOnlyWallet";

export default function Navbar() {
  const { address, isConnected, isFirebaseAuthenticated } = useAuth();
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (isConnected && address && isFirebaseAuthenticated) {
        const profileRef = doc(db, "profiles", address);
        const docSnap = await getDoc(profileRef);
        setProfileExists(docSnap.exists());
      } else {
        setProfileExists(false);
      }
    };

    checkProfile();
  }, [isConnected, address, isFirebaseAuthenticated]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-xl font-bold mr-4">BUILDRS</Link>
          <Link href="/feed" className="transition-colors hover:text-foreground/80 text-foreground/60">Feed</Link>
          <Link href="/leaderboard" className="transition-colors hover:text-foreground/80 text-foreground/60">Leaderboard</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {isConnected && isFirebaseAuthenticated ? (
            profileExists ? (
              <Link href="/profile">
                <Button variant="outline">Profile</Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button>Create Profile</Button>
              </Link>
            )
          ) : null}
          <ClientOnlyWallet />
        </div>
      </div>
    </header>
  );
}
