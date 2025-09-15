
"use client";

import Link from "next/link";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (isConnected && address) {
        const profileRef = doc(db, "profiles", address);
        const docSnap = await getDoc(profileRef);
        setProfileExists(docSnap.exists());
      } else {
        setProfileExists(false);
      }
    };

    checkProfile();
  }, [isConnected, address]);

  return (
    <nav className="p-4 flex justify-between items-center border-b border-gray-800">
      <Link href="/" className="text-2xl font-bold">BUILDRS</Link>
      <div className="flex space-x-4 items-center">
        <Link href="/feed">Feed</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        {isConnected && (
          profileExists ? (
            <Link href="/profile">Profile</Link>
          ) : (
            <Link href="/signup" className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-bold">
              Create Profile
            </Link>
          )
        )}
        <Wallet />
      </div>
    </nav>
  );
}
