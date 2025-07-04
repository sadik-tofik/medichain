"use client";

import { MeshProvider } from '@meshsdk/react';
import { PropsWithChildren } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MeshProvider>
      {children}
    </MeshProvider>
  );
}