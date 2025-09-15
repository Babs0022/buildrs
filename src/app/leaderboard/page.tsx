
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const buildsCollection = collection(db, 'builds');
      const buildsSnapshot = await getDocs(buildsCollection);
      const buildsData = buildsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const users = await Promise.all(buildsData.map(build => getDoc(doc(db, 'profiles', build.userId))));
      const usersData = users.map(user => user.data());

      const votesCollection = collection(db, 'votes');
      const votesSnapshot = await getDocs(votesCollection);
      const votesData = votesSnapshot.docs.map(doc => doc.data());

      const userUpvotes = usersData.map(user => {
        const userBuilds = buildsData.filter(build => build.userId === user.id);
        const totalUpvotes = userBuilds.reduce((acc, build) => {
          const upvotes = votesData.filter(vote => vote.buildId === build.id && vote.voteType === 'upvote').length;
          return acc + upvotes;
        }, 0);
        return { ...user, totalUpvotes };
      });

      const sortedUsers = userUpvotes.sort((a, b) => b.totalUpvotes - a.totalUpvotes);

      setLeaderboard(sortedUsers);
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Builder</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total Upvotes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {leaderboard.map((item, index) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img className="h-10 w-10 rounded-full" src={item.avatar} alt="" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{item.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.totalUpvotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
