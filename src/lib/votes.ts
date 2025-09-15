
import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, query, where, getDocs, doc } from 'firebase/firestore';

export async function upvote(userId: string, buildId: string) {
  // Check if the user has already downvoted this build
  const q = query(collection(db, 'votes'), where('userId', '==', userId), where('buildId', '==', buildId), where('voteType', '==', 'downvote'));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Remove the downvote
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  // Add the upvote
  await addDoc(collection(db, 'votes'), {
    userId,
    buildId,
    voteType: 'upvote',
    createdAt: new Date(),
  });
}

export async function downvote(userId: string, buildId: string) {
  // Check if the user has already upvoted this build
  const q = query(collection(db, 'votes'), where('userId', '==', userId), where('buildId', '==', buildId), where('voteType', '==', 'upvote'));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Remove the upvote
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
  }

  // Add the downvote
  await addDoc(collection(db, 'votes'), {
    userId,
    buildId,
    voteType: 'downvote',
    createdAt: new Date(),
  });
}
