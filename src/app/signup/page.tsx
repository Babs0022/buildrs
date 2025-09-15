
'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db, storage } from '@/lib/firebase'; // Ensure storage is imported
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Storage functions
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SignupPage() {
  const { address, isConnected, isFirebaseAuthenticated } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [farcaster, setFarcaster] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

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
      let avatarUrl = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${address}`;
      if (avatarFile) {
        const storageRef = ref(storage, `avatars/${address}`);
        await uploadBytes(storageRef, avatarFile);
        avatarUrl = await getDownloadURL(storageRef);
      }

      const constructUrl = (prefix: string, username: string) => {
        if (!username) return '';
        const cleanedUsername = username.startsWith('@')
          ? username.substring(1)
          : username;
        return `${prefix}${cleanedUsername}`;
      };

      const profileData = {
        name,
        bio,
        socialLinks: {
          twitter: constructUrl('https://twitter.com/', twitter),
          github: constructUrl('https://github.com/', github),
          farcaster: constructUrl('https://warpcast.com/', farcaster)
        },
        avatar: avatarUrl
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
    return (
      <div className="container mx-auto p-4 text-center">
        Please connect your wallet to sign up.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Create Your Profile
      </h1>
      <form
        onSubmit={handleSignup}
        className="glass-effect rounded-lg p-6 space-y-4"
      >
        <div className="flex flex-col items-center">
          <Label htmlFor="avatar">
            <div className="w-24 h-24 rounded-full bg-gray-700 mb-4 cursor-pointer">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-600" />
              )}
            </div>
          </Label>
          <Input
            id="avatar"
            type="file"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={bio}
            onChange={e => setBio(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="twitter">Twitter Username</Label>
          <Input
            id="twitter"
            type="text"
            value={twitter}
            onChange={e => setTwitter(e.target.value)}
            placeholder="@username"
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub Username</Label>
          <Input
            id="github"
            type="text"
            value={github}
            onChange={e => setGithub(e.target.value)}
            placeholder="username"
          />
        </div>
        <div>
          <Label htmlFor="farcaster">Farcaster Username</Label>
          <Input
            id="farcaster"
            type="text"
            value={farcaster}
            onChange={e => setFarcaster(e.target.value)}
            placeholder="username"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          disabled={!isFirebaseAuthenticated || isLoading}
          className="w-full"
        >
          {isLoading
            ? 'Creating...'
            : isFirebaseAuthenticated
            ? 'Create Profile'
            : 'Authenticating...'}
        </Button>
      </form>
    </div>
  );
}
