
"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/useAuth';

export default function CommentSection({ buildId }: { buildId: string }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'comments'), where('buildId', '==', buildId));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const commentsData = await Promise.all(snapshot.docs.map(async (commentDoc) => {
        const commentData = commentDoc.data();
        const userDoc = await getDoc(doc(db, 'profiles', commentData.userId));
        const userData = userDoc.data();
        return {
          id: commentDoc.id,
          ...commentData,
          author: userData,
        };
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [buildId]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('You must be logged in to comment');
      return;
    }

    if (!newComment) {
      return;
    }

    try {
      await addDoc(collection(db, 'comments'), {
        buildId,
        userId: user.uid,
        content: newComment,
        createdAt: new Date(),
      });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment: ', error);
      alert('Error adding comment');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-2">Comments</h3>
      <form onSubmit={handleAddComment} className="mb-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full bg-gray-700 rounded-md p-2"
          rows={3}
          placeholder="Add a comment..."
        ></textarea>
        <button type="submit" className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700 mt-2">Submit</button>
      </form>
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-700 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <img src={comment.author.avatar} alt={comment.author.name} className="w-6 h-6 rounded-full" />
              <span className="font-bold">{comment.author.name}</span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
