
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
  const { address, isConnected, isFirebaseAuthenticated } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [farcaster, setFarcaster] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!isConnected || !address) {
      setError('Please connect your wallet first.');
      setIsLoading(false);
      return;
    }

    if (!isFirebaseAuthenticated) {
      setError('Authenticating with Firebase... please wait.');
      setIsLoading(false);
      return;
    }

    if (!name.trim()) {
      setError('Name is required.');
      setIsLoading(false);
      return;
    }

    try {
      // Helper to remove "@" prefix and construct URL
      const constructUrl = (prefix: string, username: string) => {
        if (!username) return "";
        const cleanedUsername = username.startsWith('@') ? username.substring(1) : username;
        return `${prefix}${cleanedUsername}`;
      };

      const profileData = {
        name,
        bio,
        socialLinks: {
          twitter: constructUrl('https://twitter.com/', twitter),
          github: constructUrl('https://github.com/', github),
          farcaster: constructUrl('https://warpcast.com/', farcaster),
        },
        avatar: `https://api.dicebear.com/8.x/pixel-art/svg?seed=${address}`
      };

      await setDoc(doc(db, 'profiles', address), profileData);
      router.push('/profile');
    } catch (err) {
      console.error(err);
      setError('Failed to create profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return <div className="container mx-auto p-4 text-center">Please connect your wallet to sign up.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Profile</h1>
      <form onSubmit={handleSignup} className="bg-gray-800 rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="twitter" className="block text-sm font-medium text-gray-300">Twitter Username</label>
          <input
            id="twitter"
            type="text"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="@username"
          />
        </div>
        <div>
          <label htmlFor="github" className="block text-sm font-medium text-gray-300">GitHub Username</label>
          <input
            id="github"
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="username"
          />
        </div>
        <div>
          <label htmlFor="farcaster" className="block text-sm font-medium text-gray-300">Farcaster Username</label>
          <input
            id="farcaster"
            type="text"
            value={farcaster}
            onChange={(e) => setFarcaster(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="username"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={!isFirebaseAuthenticated || isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-bold transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating...' : (isFirebaseAuthenticated ? 'Create Profile' : 'Authenticating...')}
        </button>
      </form>
    </div>
  );
}
