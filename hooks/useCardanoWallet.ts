"use client";

import { useWallet } from '@meshsdk/react';
import { useEffect, useState } from 'react';

export function useCardanoWallet() {
  const { connect, connected, connecting, disconnect, name, wallet, error } = useWallet();
  const [isClient, setIsClient] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isWalletAvailable, setIsWalletAvailable] = useState(false);
  const [walletApi, setWalletApi] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    
    const checkWallet = () => {
      const isAvailable = !!window.cardano?.eternl;
      setIsWalletAvailable(isAvailable);
      return isAvailable;
    };
    
    checkWallet();
    
    // Listen for wallet changes
    const interval = setInterval(checkWallet, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (error) {
      console.error('Wallet error:', error);
      let errorMessage = 'Failed to connect to wallet.';
      
      if (!isWalletAvailable) {
        errorMessage = 'Eternl wallet not detected. Please install the Eternl wallet extension.';
      } else if (error instanceof Error) {
        if (error.message.includes('user reject')) {
          errorMessage = 'Connection was rejected. Please try again.';
        } else if (error.message.includes('enable')) {
          errorMessage = 'Failed to enable Eternl wallet. Please check your wallet extension.';
        }
      }
      
      setConnectionError(errorMessage);
    } else {
      setConnectionError(null);
    }
  }, [error, isWalletAvailable]);

  const handleConnect = async () => {
    try {
      setConnectionError(null);
      console.log('Attempting to connect to Eternl wallet...');
      
      if (!isWalletAvailable) {
        throw new Error('Eternl wallet not detected. Please make sure the Eternl extension is installed and enabled.');
      }

      // Check if the wallet is already enabled
      const isEnabled = await (window.cardano?.eternl as any)?.isEnabled?.();
      
      console.log('Enabling Eternl wallet...');
      try {
        const api = await window.cardano?.eternl?.enable();
        
        if (!api) {
          throw new Error('Failed to get Eternl wallet API after enabling');
        }
        
        setWalletApi(api);
        console.log('Eternl wallet enabled, connecting with Mesh...');
        
        // Connect with Mesh using the Eternl wallet name
        await connect('eternl');
        console.log('Wallet connection successful');
      } catch (enableError) {
        console.error('Error enabling Eternl wallet:', enableError);
        const errorMessage = enableError instanceof Error 
          ? enableError.message 
          : typeof enableError === 'string'
            ? enableError
            : 'Unknown error enabling Eternl wallet';
        throw new Error(`Failed to enable Eternl wallet: ${errorMessage}`);
      }
      
    } catch (error) {
      console.error('Error in handleConnect:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred while connecting to the wallet';
      
      setConnectionError(errorMessage);
      throw error;
    }
  };

  const handleDisconnect = async () => {
    try {
      console.log('Disconnecting wallet...');
      await disconnect();
      setWalletApi(null);
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      throw error;
    }
  };

  return {
    wallet,
    walletApi,
    connected: isClient && connected,
    connecting: isClient && connecting,
    name: name || '',
    connect: handleConnect,
    disconnect: handleDisconnect,
    isClient,
    error: connectionError,
    isWalletAvailable,
  };
}