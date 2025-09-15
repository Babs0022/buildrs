
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function EditProfilePage() {
  const { address, isConnected, isFirebaseAuthenticated } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [farcaster, setFarcaster] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (isConnected && address && isFirebaseAuthenticated) {
        const profileDoc = await getDoc(doc(db, 'profiles', address));
        if (profileDoc.exists()) {
          const data = profileDoc.data();
          setName(data.name || '');
          setBio(data.bio || '');
          // Extract usernames from URLs for editing
          setTwitter(data.socialLinks?.twitter?.split('/').pop() || '');
          setGithub(data.socialLinks?.github?.split('/').pop() || '');
          setFarcaster(data.socialLinks?.farcaster?.split('/').pop() || '');
        } else {
            // If no profile, redirect to signup
            router.push('/signup');
        }
      }
    };
    fetchProfile();
  }, [isConnected, address, isFirebaseAuthenticated, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name.trim()) {
      setError('Name is required.');
      setIsLoading(false);
      return;
    }

    try {
      const constructUrl = (prefix: string, username: string) => {
        if (!username) return "";
        const cleanedUsername = username.startsWith('@') ? username.substring(1) : username;
        return `${prefix}${cleanedUsername}`;
      };

      const profileRef = doc(db, 'profiles', address!);
      await updateDoc(profileRef, {
        name,
        bio,
        socialLinks: {
          twitter: constructUrl('https://twitter.com/', twitter),
          github: constructUrl('https://github.com/', github),
          farcaster: constructUrl('https://warpcast.com/', farcaster),
        },
      });
      router.push('/profile');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected || !isFirebaseAuthenticated) {
    return <div className="container mx-auto p-4 text-center">Please connect your wallet and authenticate to edit your profile.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Your Profile</h1>
      <form onSubmit={handleUpdate} className="bg-gray-800 rounded-lg p-6 space-y-4">
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
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-bold transition-colors disabled:bg-gray-500"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
