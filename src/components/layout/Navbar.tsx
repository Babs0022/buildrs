
"use client";

import Link from "next/link";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Navbar() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      const profileRef = doc(db, "profiles", address);
      getDoc(profileRef).then((docSnap) => {
        if (!docSnap.exists()) {
          setDoc(profileRef, {
            name: "Unnamed Builder",
            avatar: `https://i.pravatar.cc/150?u=${address}`,
            bio: "",
            socialLinks: {},
          });
        }
      });
    }
  }, [isConnected, address]);

  return (
    <nav className="p-4 flex justify-between items-center border-b border-gray-800">
      <Link href="/" className="text-2xl font-bold">BUILDRS</Link>
      <div className="flex space-x-4 items-center">
        <Link href="/feed">Feed</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        <Link href="/profile">Profile</Link>
        <Wallet />
      </div>
    </nav>
  );
}
