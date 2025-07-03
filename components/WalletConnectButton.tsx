'use client';

import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WalletConnectButton() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true on component mount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);
    
    try {
      // Simulate wallet connection for demo
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnected(true);
      setWalletName('Demo Wallet');
    } catch (err) {
      setError('Failed to connect wallet');
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    setWalletName(null);
    setError(null);
  };

  // Show loading state if not mounted yet
  if (!isMounted) {
    return (
      <Button disabled variant="outline" className="min-w-[120px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </Button>
    );
  }

  // Show connect button if not connected
  if (!connected) {
    return (
      <Button 
        onClick={handleConnect} 
        disabled={connecting}
        className="min-w-[120px]"
      >
        {connecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  // Show connected state
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="text-sm font-medium text-green-600">
          {walletName || 'Wallet'} Connected
        </div>
        <Button 
          onClick={handleDisconnect} 
          variant="outline" 
          size="sm"
          className="h-8"
        >
          <LogOut className="h-3 w-3 mr-1" />
          Disconnect
        </Button>
      </div>
      {error && (
        <div className="text-xs text-red-500 max-w-[200px] truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
}