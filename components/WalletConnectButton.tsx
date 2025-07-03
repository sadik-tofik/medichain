"use client";

import { Button } from '@/components/ui/button';
import { Wallet, AlertCircle, Download, Loader2 } from 'lucide-react';
import { useCardanoWallet } from '@/hooks/useCardanoWallet';
import { useEffect, useState } from 'react';

export function WalletConnectButton() {
  const { 
    connected, 
    connecting, 
    name, 
    connect, 
    disconnect, 
    error,
    isWalletAvailable
  } = useCardanoWallet();
  
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Small delay to ensure wallet detection is complete
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowError(true);
      // Hide error after 10 seconds
      const timer = setTimeout(() => {
        setShowError(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle install wallet button click
  const handleInstallWallet = () => {
    window.open('https://eternl.io/', '_blank', 'noopener,noreferrer');
  };

  if (!isInitialized) {
    return (
      <Button disabled className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Initializing...</span>
      </Button>
    );
  }

  if (connected && name) {
    return (
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2">
          <div className="flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-primary/10 text-primary">
            <Wallet className="w-4 h-4 mr-2" />
            {`${name.slice(0, 10)}...${name.slice(-4)}`}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={disconnect}
            className="whitespace-nowrap"
            disabled={connecting}
          >
            {connecting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        </div>
        {showError && (
          <div className="flex items-center text-xs text-red-500 max-w-[250px] text-right">
            <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end space-y-2">
      {!isWalletAvailable ? (
        <Button 
          onClick={handleInstallWallet}
          className="flex items-center space-x-2 whitespace-nowrap bg-blue-600 hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          <span>Install Eternl Wallet</span>
        </Button>
      ) : (
        <Button 
          onClick={connect} 
          disabled={connecting}
          className="flex items-center space-x-2 whitespace-nowrap"
        >
          {connecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wallet className="w-4 h-4" />
          )}
          <span>{connecting ? 'Connecting to Eternl...' : 'Connect Eternl Wallet'}</span>
        </Button>
      )}
      {showError && (
        <div className="flex items-center text-xs text-red-500 max-w-[250px] text-right">
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}