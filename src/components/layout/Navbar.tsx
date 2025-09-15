
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
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
    <nav className="p-4 flex justify-between items-center border-b border-gray-800">
      <Link href="/" className="text-2xl font-bold">BUILDRS</Link>
      <div className="flex space-x-4 items-center">
        <Link href="/feed">Feed</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        {isConnected && isFirebaseAuthenticated && (
          profileExists ? (
            <Link href="/profile">Profile</Link>
          ) : (
            <Link href="/signup" className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-bold">
              Create Profile
            </Link>
          )
        )}
        <ClientOnlyWallet />
      </div>
    </nav>
  );
}
