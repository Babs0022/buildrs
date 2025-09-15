
"use client";

import dynamic from 'next/dynamic';

// Dynamically import the Wallet component with SSR turned off
const WalletComponent = dynamic(
  () => import('@coinbase/onchainkit/wallet').then(mod => mod.Wallet),
  { ssr: false }
);

export default function ClientOnlyWallet() {
  return <WalletComponent />;
}
