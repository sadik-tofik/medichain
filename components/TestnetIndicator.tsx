'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { TestTube, Database } from 'lucide-react';

export default function TestnetIndicator() {
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';
  
  return (
    <Alert className="bg-orange-50 border-orange-200 mb-6">
      <TestTube className="h-4 w-4 text-orange-600" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-orange-800 font-medium">
            Using Cardano Testnet & Neon Database — No real ADA required
          </span>
          <div className="flex space-x-1">
            {isMockMode && (
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                Mock Mode
              </Badge>
            )}
            <Badge variant="outline" className="border-orange-300 text-orange-700">
              <Database className="w-3 h-3 mr-1" />
              Neon
            </Badge>
          </div>
        </div>
        <a 
          href="https://faucet.preprod.world.dev.cardano.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-orange-600 hover:text-orange-800 underline text-sm"
        >
          Get Free Test ADA
        </a>
      </AlertDescription>
    </Alert>
  );
}