
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '@/lib/firebase';

type UseAuthReturn = {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  isFirebaseAuthenticated: boolean;
  user: User | null;
  handleSignIn: () => Promise<void>;
  handleSignOut: () => Promise<void>;
};

export function useAuth(): UseAuthReturn {
  const { address, isConnected } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const authenticate = useCallback(async (walletAddress: `0x${string}`) => {
    try {
      const response = await axios.post('/api/auth', {
        address: walletAddress
      });
      const { token } = response.data;
      await signInWithCustomToken(auth, token);
    } catch (error) {
      console.error('Firebase sign-in failed:', error);
      setIsFirebaseAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsFirebaseAuthenticated(true);
      } else {
        setUser(null);
        setIsFirebaseAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isConnected && address && !isFirebaseAuthenticated) {
      authenticate(address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, isFirebaseAuthenticated]);

  const handleSignIn = async () => {
    // wagmi's connect opens a modal, so we don't need to do much here
    // but we can wrap it in case we want to add logic later.
    // This function might not be strictly necessary if the button itself can trigger the connection.
  };

  const handleSignOut = async () => {
    await signOut(auth);
    await disconnectAsync();
  };

  return {
    address,
    isConnected,
    isFirebaseAuthenticated,
    user,
    handleSignIn,
    handleSignOut
  };
}
