'use client';

import { Button } from '@/components/ui/button';
import { useWallet } from '@/contexts/WalletContext';
import { Wallet, LogOut, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WalletConnectButton() {
  const { 
    connected, 
    connecting, 
    connectWallet, 
    disconnectWallet, 
    getBalance,
    getNetworkId,
    error: walletError,
    walletName
  } = useWallet();
  
  const [balance, setBalance] = useState<string>('0');
  const [network, setNetwork] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set isMounted to true on component mount
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Update error state when walletError changes
  useEffect(() => {
    if (walletError) {
      setError(walletError);
      // Clear error after 5 seconds
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [walletError]);

  // Fetch wallet info when connected
  useEffect(() => {
    if (!connected) {
      setBalance('0');
      setNetwork(null);
      return;
    }

    const fetchWalletInfo = async () => {
      try {
        const [balance, networkId] = await Promise.all([
          getBalance(),
          getNetworkId()
        ]);
        
        if (isMounted) {
          setBalance(balance);
          setNetwork(networkId);
        }
      } catch (err) {
        console.error('Error fetching wallet info:', err);
        if (isMounted) {
          setError('Failed to fetch wallet information');
        }
      }
    };

    fetchWalletInfo();
    
    // Set up an interval to update the balance every 30 seconds
    const interval = setInterval(fetchWalletInfo, 30000);
    
    return () => clearInterval(interval);
  }, [connected, getBalance, getNetworkId, isMounted]);

  const handleConnect = async () => {
    try {
      setError(null);
      await connectWallet();
    } catch (err) {
      console.error('Connection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to wallet');
    }
  };

  const handleDisconnect = () => {
    try {
      disconnectWallet();
      setBalance('0');
      setNetwork(null);
      setError(null);
    } catch (err) {
      console.error('Disconnection error:', err);
      setError('Failed to disconnect wallet');
    }
  };

  // Format ADA balance
  const formatAda = (lovelace: string) => {
    try {
      const ada = parseFloat(lovelace) / 1000000;
      return ada.toLocaleString(undefined, { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 6 
      });
    } catch (err) {
      console.error('Error formatting ADA:', err);
      return '0.00';
    }
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
      {balance !== '0' && (
        <div className="text-xs text-gray-500">
          Balance: {formatAda(balance)} ₳
          {network !== null && ` • Network: ${network === 1 ? 'Mainnet' : network === 0 ? 'Testnet' : network}`}
        </div>
      )}
      {error && (
        <div className="text-xs text-red-500 max-w-[200px] truncate" title={error}>
          {error}
        </div>
      )}
    </div>
  );
}
