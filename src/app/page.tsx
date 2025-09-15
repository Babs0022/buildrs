import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight text-foreground sm:text-8xl">
          BUILDRS
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          You are what you build.
        </p>
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-6">
        <Link href="/feed">
          <Button size="lg" className="w-full sm:w-auto">
            View Feed
          </Button>
        </Link>
        <Link href="/leaderboard">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto">
            Leaderboard
          </Button>
        </Link>
      </div>
    </main>
  );
}