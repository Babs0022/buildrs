
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

// A helper function to handle all vote logic
const handleVote = async (userId: string, buildId: string, newVoteType: 'upvote' | 'downvote') => {
  // Create a unique ID for the vote document based on the user and build
  const voteDocId = `${userId}_${buildId}`;
  const voteRef = doc(db, 'votes', voteDocId);

  try {
    const voteDoc = await getDoc(voteRef);

    if (voteDoc.exists()) {
      const existingVoteType = voteDoc.data().voteType;
      
      if (existingVoteType === newVoteType) {
        // User is clicking the same button again, so remove the vote
        await deleteDoc(voteRef);
      } else {
        // User is changing their vote
        await setDoc(voteRef, {
          userId,
          buildId,
          voteType: newVoteType,
          createdAt: serverTimestamp(),
        }, { merge: true }); // Use merge to update or create
      }
    } else {
      // User is voting for the first time on this build
      await setDoc(voteRef, {
        userId,
        buildId,
        voteType: newVoteType,
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error(`Error handling ${newVoteType}:`, error);
    // Optionally, re-throw the error to be handled by the UI
    throw error;
  }
};

export const upvote = (userId: string, buildId: string) => {
  return handleVote(userId, buildId, 'upvote');
};

export const downvote = (userId: string, buildId: string) => {
  return handleVote(userId, buildId, 'downvote');
};
