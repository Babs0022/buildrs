
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
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
  const { connectAsync, connectors } = useConnect();
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
    try {
      // Find an injected connector (like MetaMask) or default to the first available one.
      const connector = connectors.find(c => c.id === 'injected' || c.id === 'metaMask') || connectors[0];
      if (connector) {
        await connectAsync({ connector });
      } else {
        // Handle the case where no connectors are found.
        // This could be a console log, or a user-facing message.
        console.error("No wallet connectors available.");
        alert("Please install a web3 wallet to continue.");
      }
    } catch (error) {
      console.error("Error connecting wallet: ", error);
    }
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
