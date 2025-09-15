import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">BUILDRS</h1>
      <p className="text-xl mb-8">You are what you build.</p>
      <div className="flex space-x-4">
        <Link href="/feed" className="px-6 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
          View Feed
        </Link>
        <Link href="/leaderboard" className="px-6 py-2 bg-gray-700 rounded-md hover:bg-gray-800">
          Leaderboard
        </Link>
      </div>
    </div>
  );
}