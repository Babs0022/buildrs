'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { FaFeatherAlt } from 'react-icons/fa';

export function Navbar() {
  const { user, handleSignIn, handleSignOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full glass-effect">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/logo.png" alt="BUILDRS" width={32} height={32} />
          <span className="font-bold sm:inline-block">BUILDRS</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link
            href="/feed"
            className="transition-colors hover:text-primary"
          >
            Feed
          </Link>
          <Link
            href="/leaderboard"
            className="transition-colors hover:text-primary"
          >
            Leaderboard
          </Link>
          {user && (
            <Link
              href="/profile"
              className="transition-colors hover:text-primary"
            >
              Profile
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSignOut}
              className="px-4"
            >
              Sign Out
            </Button>
          ) : (
            <Button size="sm" onClick={handleSignIn} className="px-4">
              Connect Wallet
            </Button>
          )}
          <Link href="/add-build">
            <Button size="sm" className="flex items-center gap-2">
              <FaFeatherAlt />
              <span>Add Build</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}