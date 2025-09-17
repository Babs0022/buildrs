import Image from 'next/image';
import Link from 'next/link';

export function TopBar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="BUILDRS" width={28} height={28} />
        </Link>
      </div>
    </header>
  );
}