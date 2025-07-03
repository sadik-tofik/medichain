'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface WalletContextType {
  wallet: any | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
  walletName: string | null;
  connectWallet: (walletName?: string) => Promise<any | undefined>;
  disconnectWallet: () => void;
  getBalance: () => Promise<string>;
  getNetworkId: () => Promise<number>;
  isInitialized: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<any | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize wallet connection
  useEffect(() => {
    const initWallet = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const savedWallet = localStorage.getItem('connectedWallet');
        if (savedWallet) {
          await connectWallet(savedWallet);
        }
      } catch (err) {
        console.error('Failed to initialize wallet:', err);
        localStorage.removeItem('connectedWallet');
      } finally {
        setIsInitialized(true);
      }
    };

    initWallet();
  }, []);

  const connectWallet = useCallback(async (walletName?: string) => {
    if (connecting) return;
    
    setConnecting(true);
    setError(null);
    
    try {
      // Mock wallet connection for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWallet = {
        getBalance: () => Promise.resolve('1000000000'), // 1000 ADA in lovelace
        getNetworkId: () => Promise.resolve(0), // Testnet
      };

      setWallet(mockWallet);
      setConnected(true);
      setWalletName(walletName || 'Demo Wallet');
      localStorage.setItem('connectedWallet', walletName || 'demo');
      
      return mockWallet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to wallet';
      setError(errorMessage);
      console.error('Wallet connection error:', err);
      localStorage.removeItem('connectedWallet');
      throw err;
    } finally {
      setConnecting(false);
    }
  }, [connecting]);

  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setConnected(false);
    setWalletName(null);
    setError(null);
    localStorage.removeItem('connectedWallet');
  }, []);

  const getBalance = useCallback(async (): Promise<string> => {
    if (!wallet) return '0';
    
    try {
      const balance = await wallet.getBalance();
      return balance.toString();
    } catch (err) {
      console.error('Error getting balance:', err);
      return '0';
    }
  }, [wallet]);

  const getNetworkId = useCallback(async (): Promise<number> => {
    if (!wallet) return 0;
    
    try {
      const networkId = await wallet.getNetworkId();
      return networkId;
    } catch (err) {
      console.error('Error getting network ID:', err);
      return 0;
    }
  }, [wallet]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connected,
        connecting,
        error,
        walletName,
        connectWallet,
        disconnectWallet,
        getBalance,
        getNetworkId,
        isInitialized,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}