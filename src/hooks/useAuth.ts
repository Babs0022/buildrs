
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import axios from 'axios';
import { auth } from '@/lib/firebase';
import { useWallet } from '@coinbase/onchainkit/wallet';

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
  const { connect, disconnect } = useWallet();
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
    await connect();
  };

  const handleSignOut = async () => {
    await signOut(auth);
    await disconnect();
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
