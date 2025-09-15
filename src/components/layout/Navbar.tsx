'use client';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  const { user, handleSignIn, handleSignOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full glass-effect">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src="/logo.png" alt="BUILDRS" width={32} height={32} />
          <span className="font-bold sm:inline-block">BUILDRS</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link
            href="/feed"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Feed
          </Link>
          <Link
            href="/leaderboard"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Leaderboard
          </Link>
          {user && (
            <Link
              href="/profile"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Profile
            </Link>
          )}
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
        </nav>
      </div>
    </header>
  );
}