"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useWallet } from '@meshsdk/react';

// Let TypeScript infer the wallet type from useWallet
type WalletType = ReturnType<typeof useWallet>['wallet'];

type WalletContextType = {
  wallet: WalletType;
  connected: boolean;
  connecting: boolean;
  name: string | undefined;
  connect: (walletName: string) => Promise<void>;
  disconnect: () => Promise<void>;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { wallet, connected, connect, disconnect, connecting, name } = useWallet();

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        connecting,
        name,
        connect: async (walletName: string) => {
          await connect(walletName);
        },
        disconnect: async () => {
          await disconnect();
        },
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
}