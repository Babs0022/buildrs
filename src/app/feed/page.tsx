
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { upvote, downvote } from '@/lib/votes';
import CommentSection from '@/components/comments/CommentSection';
import { BuildCard } from '@/components/BuildCard'; // Import the new BuildCard component

type BuildType = 'Launch' | 'Update' | 'Experiment';

interface Builder {
  avatar: string;
  name: string;
}

interface Build {
  id: string;
  type: BuildType;
  title: string;
  description: string;
  tags: string[];
  link: string;
  builder: Builder;
  upvotes?: number;
  downvotes?: number;
}

export default function FeedPage() {
  const { user } = useAuth();
  const [builds, setBuilds] = useState<Build[]>([]);
  const [commentSections, setCommentSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchBuilds = async () => {
      const buildsCollection = collection(db, 'builds');
      const buildsSnapshot = await getDocs(buildsCollection);
      const buildsData = await Promise.all(buildsSnapshot.docs.map(async (buildDoc) => {
        const buildData = buildDoc.data();
        const userDoc = await getDoc(doc(db, 'profiles', buildData.userId));
        const userData = userDoc.data();

        return {
          id: buildDoc.id,
          ...buildData,
          builder: userData,
        } as Build;
      }));
      setBuilds(buildsData);
    };

    fetchBuilds();
  }, []);

  useEffect(() => {
    if (builds.length > 0) {
      const unsubscribes = builds.map(build => {
        const q = query(collection(db, 'votes'), where('buildId', '==', build.id));
        return onSnapshot(q, (snapshot) => {
          const votes = snapshot.docs.map(doc => doc.data());
          const upvotes = votes.filter(vote => vote.voteType === 'upvote').length;
          const downvotes = votes.filter(vote => vote.voteType === 'downvote').length;
          setBuilds(prevBuilds => prevBuilds.map(prevBuild => {
            if (prevBuild.id === build.id) {
              return { ...prevBuild, upvotes, downvotes };
            }
            return prevBuild;
          }));
        });
      });
      return () => unsubscribes.forEach(unsub => unsub());
    }
  }, [builds]);

  const handleUpvote = async (buildId: string) => {
    if (!user) {
      alert('You must be logged in to vote');
      return;
    }
    await upvote(user.uid, buildId);
  };

  const handleDownvote = async (buildId: string) => {
    if (!user) {
      alert('You must be logged in to vote');
      return;
    }
    await downvote(user.uid, buildId);
  };

  const toggleCommentSection = (buildId: string) => {
    setCommentSections(prev => ({ ...prev, [buildId]: !prev[buildId] }));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Build Feed</h1>
        <Link href="/add-build" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
          Add a Build
        </Link>
      </div>
      <div className="space-y-4">
        {builds.map((build) => (
          <div key={build.id}>
            <BuildCard
              avatarImage={build.builder.avatar}
              name={build.builder.name}
              title={build.title}
              description={build.description}
              upvotes={build.upvotes || 0}
            />
            <div className="flex items-center justify-between mt-4">
              <a href={build.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Build</a>
              <div className="flex items-center space-x-4">
                <button onClick={() => handleUpvote(build.id)} className="flex items-center space-x-1">
                  <span>▲</span>
                  <span>{build.upvotes || 0}</span>
                </button>
                <button onClick={() => handleDownvote(build.id)} className="flex items-center space-x-1">
                  <span>▼</span>
                  <span>{build.downvotes || 0}</span>
                </button>
                <button onClick={() => toggleCommentSection(build.id)}>Comment</button>
              </div>
            </div>
            {commentSections[build.id] && <CommentSection buildId={build.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}
