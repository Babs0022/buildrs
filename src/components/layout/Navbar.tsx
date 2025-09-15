
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { auth } from "@/lib/firebase";

export default function Navbar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="p-4 flex justify-between items-center border-b border-gray-800">
      <Link href="/" className="text-2xl font-bold">BUILDRS</Link>
      <div className="flex space-x-4">
        <Link href="/feed">Feed</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <Link href="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
