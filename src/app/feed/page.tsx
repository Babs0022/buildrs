
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { upvote, downvote } from '@/lib/votes';
import CommentSection from '@/components/comments/CommentSection';

const buildTypeClasses = {
  Launch: 'bg-blue-600',
  Update: 'bg-yellow-600',
  Experiment: 'bg-green-600',
};

export default function FeedPage() {
  const { user } = useAuth();
  const [builds, setBuilds] = useState<any[]>([]);
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
        };
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
  }, [builds.length]);

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
          <div key={build.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex space-x-4">
              <div className={`w-2 ${buildTypeClasses[build.type]}`}></div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <img src={build.builder.avatar} alt={build.builder.name} className="w-8 h-8 rounded-full" />
                  <span className="font-bold">{build.builder.name}</span>
                </div>
                <h2 className="text-xl font-bold">{build.title}</h2>
                <p className="text-gray-400">{build.description}</p>
                <div className="flex space-x-2 mt-2">
                  {build.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-1 bg-gray-700 rounded-md text-sm">{tag}</span>
                  ))}
                </div>
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
              </div>
            </div>
            {commentSections[build.id] && <CommentSection buildId={build.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}
