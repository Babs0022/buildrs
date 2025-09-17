'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  FaFeatherAlt,
  FaHome,
  FaTrophy,
  FaUser,
  FaSignInAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function BottomNavbar() {
  const { user, handleSignIn, handleSignOut } = useAuth();
  const pathname = usePathname();

  if (!user && pathname === '/') {
    return null;
  }

  const navLinks = [
    { href: '/feed', icon: <FaHome />, label: 'Feed' },
    { href: '/leaderboard', icon: <FaTrophy />, label: 'Leaderboard' },
    { href: '/add-build', icon: <FaFeatherAlt />, label: 'Add Build' },
    { href: '/profile', icon: <FaUser />, label: 'Profile' }
  ];

  return (
    <footer className="fixed bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <nav className="flex w-full items-center justify-around gap-2">
          {user &&
            navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={pathname === link.href ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'flex flex-col items-center h-12 justify-center gap-1 px-2 text-xs w-20 sm:w-24'
                  )}
                >
                  {link.icon}
                  <span className="sm:inline-block">{link.label}</span>
                </Button>
              </Link>
            ))}
        </nav>
        <div className="absolute right-4 flex items-center">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="flex flex-col items-center h-12 justify-center gap-1 px-2 text-xs"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline-block">Sign Out</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSignIn}
              className="flex flex-col items-center h-12 justify-center gap-1 px-2 text-xs"
            >
              <FaSignInAlt />
              <span className="hidden sm:inline-block">Connect</span>
            </Button>
          )}
        </div>
      </div>
    </footer>
  );
}