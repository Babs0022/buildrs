
"use client";

import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client-side providers with SSR turned off
const DynamicClientProviders = dynamic(
  () => import('./client-providers').then(mod => mod.ClientProviders),
  { ssr: false }
);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DynamicClientProviders>
      {children}
    </DynamicClientProviders>
  );
}
