"use client";

import { MeshProvider } from '@meshsdk/react';
import { PropsWithChildren } from 'react';
import { getMeshWalletOptions } from '@/lib/wallet';

export function Providers({ children }: { children: React.ReactNode }) {
  const walletOptions = getMeshWalletOptions();
  
  return (
    <MeshProvider 
      wallets={walletOptions}
      autoConnect={false}
      networkId={0} // 0 for testnet, 1 for mainnet
      autoDetectWallet={false}
      autoReconnect={false}
      // Disable default wallet detection
      disableDefaultWallets={true}
      // Disable automatic wallet connection
      disableAutoConnect={true}
    >
      {children}
    </MeshProvider>
  );
}