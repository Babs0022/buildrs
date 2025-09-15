
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaTwitter, FaGithub, FaLink } from 'react-icons/fa6';
import { getBuilderScore } from '@/lib/talent-protocol';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

type BuildType = 'Launch' | 'Update' | 'Experiment';

interface Build {
  id: string;
  type: BuildType;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

// ... (interfaces and type classes remain the same)

export default function ProfilePage() {
  const { address, isConnected } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [builderScore, setBuilderScore] = useState<number | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      const fetchProfile = async () => {
        const profileDoc = await getDoc(doc(db, 'profiles', address));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        }
      };

      const fetchBuilds = async () => {
        const buildsCollection = collection(db, 'builds');
        const q = query(buildsCollection, where('userId', '==', address));
        const buildsSnapshot = await getDocs(q);
        const buildsData = buildsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Build));
        setBuilds(buildsData);
      };

      const fetchBuilderScore = async () => {
        const score = await getBuilderScore(address);
        setBuilderScore(score);
      };

      fetchProfile();
      fetchBuilds();
      fetchBuilderScore();
    }
  }, [isConnected, address]);

  const handleDeleteBuild = async (buildId: string) => {
    try {
      await deleteDoc(doc(db, 'builds', buildId));
      setBuilds(builds.filter(build => build.id !== buildId));
      toast.success("Build deleted successfully.");
    } catch (error) {
      console.error("Error deleting build: ", error);
      toast.error("Failed to delete build. Please try again.");
    }
  };

  if (!profile) {
    return <div className="text-center p-10">Please connect your wallet to view your profile.</div>;
  }

  // Check if the logged-in user is viewing their own profile
  const isOwnProfile = isConnected && address === profile.userId;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-6">
          <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full" />
          <div className="flex-1">
            <CardTitle className="text-3xl">{profile.name}</CardTitle>
            <CardDescription>{profile.bio}</CardDescription>
            <div className="flex space-x-4 mt-2">
              {profile.socialLinks?.twitter && <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>}
              {profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>}
              {profile.socialLinks?.farcaster && <a href={profile.socialLinks.farcaster} target="_blank" rel="noopener noreferrer"><FaLink /></a>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">Builder Score</div>
            <div className="text-3xl font-bold text-primary">{builderScore ?? '...'}</div>
            {isOwnProfile && (
              <Link href="/profile/edit" className="mt-2">
                <Button variant="outline">Edit Profile</Button>
              </Link>
            )}
          </div>
        </CardHeader>
      </Card>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Builds</h2>
          {isOwnProfile && (
            <Link href="/add-build">
              <Button>Add a Build</Button>
            </Link>
          )}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {builds.map((build) => (
            <Card key={build.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{build.title}</CardTitle>
                <CardDescription>{build.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {build.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">{tag}</span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <a href={build.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">
                  View Build
                </a>
                {isOwnProfile && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your build.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteBuild(build.id)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
