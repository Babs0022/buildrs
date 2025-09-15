
"use client";

import { useState, useEffect } from 'react';
import { FaTwitter, FaGithub, FaLink } from 'react-icons/fa6';
import { getBuilderScore } from '@/lib/talent-protocol';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

type BuildType = 'Launch' | 'Update' | 'Experiment';

interface Build {
  id: string;
  type: BuildType;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

const buildTypeClasses: Record<BuildType, string> = {
    Launch: 'bg-blue-600',
    Update: 'bg-yellow-600',
    Experiment: 'bg-green-600',
  };

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [builderScore, setBuilderScore] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const profileDoc = await getDoc(doc(db, 'profiles', user.uid));
        if (profileDoc.exists()) {
          setProfile(profileDoc.data());
        }
      };

      const fetchBuilds = async () => {
        const buildsCollection = collection(db, 'builds');
        const q = query(buildsCollection, where('userId', '==', user.uid));
        const buildsSnapshot = await getDocs(q);
        const buildsData = buildsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Build));
        setBuilds(buildsData);
      };

      const fetchBuilderScore = async () => {
        const score = await getBuilderScore(user.uid);
        setBuilderScore(score);
      };

      fetchProfile();
      fetchBuilds();
      fetchBuilderScore();
    }
  }, [user]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg p-6 flex items-center space-x-6">
        <img src={profile.avatar} alt={profile.name} className="w-24 h-24 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold">{profile.name}</h1>
          <p className="text-gray-400">{profile.bio}</p>
          <div className="flex space-x-4 mt-2">
            <a href={profile.socialLinks?.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href={profile.socialLinks?.github} target="_blank" rel="noopener noreferrer"><FaGithub /></a>
            <a href={profile.socialLinks?.farcaster} target="_blank" rel="noopener noreferrer"><FaLink /></a>
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-lg font-bold">Builder Score</div>
          <div className="text-3xl font-bold text-blue-400">{builderScore}</div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Builds</h2>
        <div className="space-y-4">
          {builds.map((build) => (
            <div key={build.id} className="bg-gray-800 p-4 rounded-lg flex space-x-4">
                 <div className={`w-2 ${buildTypeClasses[build.type]}`}></div>
                 <div className="flex-1">
                    <h3 className="text-xl font-bold">{build.title}</h3>
                    <p className="text-gray-400">{build.description}</p>
                    <div className="flex space-x-2 mt-2">
                        {build.tags.map((tag: string) => (
                        <span key={tag} className="px-2 py-1 bg-gray-700 rounded-md text-sm">{tag}</span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <a href={build.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Build</a>
                        <div className="flex items-center space-x-4">
                        {/* <button className="flex items-center space-x-1">
                            <span>▲</span>
                            <span>{build.upvotes}</span>
                        </button>
                        <button className="flex items-center space-x-1">
                            <span>▼</span>
                            <span>{build.downvotes}</span>
                        </button> */}
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
