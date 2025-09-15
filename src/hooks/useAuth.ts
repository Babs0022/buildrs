
"use client";

import { useAccount } from 'wagmi';

type UseAuthReturn = {
  address: `0x${string}` | undefined;
  isConnected: boolean;
};

export function useAuth(): UseAuthReturn {
  const { address, isConnected } = useAccount();

  return { address, isConnected };
}
