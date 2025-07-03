"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { CardanoWallet, useWallet } from '@meshsdk/react';
import { Wallet } from '@meshsdk/core';

type WalletContextType = {
  wallet: Wallet | null;
  connected: boolean;
  connecting: boolean;
  name: string | undefined;
  connect: () => Promise<void>;
  disconnect: () => void;
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
        connect,
        disconnect,
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
