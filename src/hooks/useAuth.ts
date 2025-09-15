
"use client";

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { getAuth, signInWithCustomToken, onAuthStateChanged, User } from 'firebase/auth';
import axios from 'axios';

type UseAuthReturn = {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isFirebaseAuthenticated: boolean;
  user: User | null;
};

export function useAuth(): UseAuthReturn {
  const { address, isConnected } = useAccount();
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const authenticate = async (walletAddress: `0x${string}`) => {
      try {
        const response = await axios.post('/api/auth', { address: walletAddress });
        const { token } = response.data;
        await signInWithCustomToken(auth, token);
      } catch (error) {
        console.error("Firebase sign-in failed:", error);
        setIsFirebaseAuthenticated(false);
      }
    };

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsFirebaseAuthenticated(true);
      } else {
        setUser(null);
        setIsFirebaseAuthenticated(false);
        // If wallet is connected but Firebase auth is lost, try to re-authenticate
        if (isConnected && address) {
          authenticate(address);
        }
      }
    });

    // Initial authentication check
    if (isConnected && address && !auth.currentUser) {
      authenticate(address);
    }

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [isConnected, address]);

  return { address, isConnected, isFirebaseAuthenticated, user };
}
