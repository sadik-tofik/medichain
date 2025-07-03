'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import QrScanner from '@/components/QrScanner';
import VerificationResult from '@/components/VerificationResult';
import TestnetIndicator from '@/components/TestnetIndicator';
import { Scan, Search, Camera, Smartphone } from 'lucide-react';

type VerificationStatus = 'idle' | 'scanning' | 'verified' | 'fake' | 'error';

interface DrugInfo {
  batchId: string;
  drugName: string;
  manufacturer: string;
  expiryDate: string;
  dosage: string;
  status: 'genuine' | 'fake';
  verificationTime: string;
  blockchainTx?: string;
}

export default function VerifyPage() {
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
  const [drugInfo, setDrugInfo] = useState<DrugInfo | null>(null);
  const [manualId, setManualId] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const isMockMode = process.env.NEXT_PUBLIC_MOCK_MODE === 'true';

  const handleScan = async (scannedId: string) => {
    setVerificationStatus('scanning');
    setShowScanner(false);
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          batchId: scannedId,
          pharmacyId: 'demo_pharmacy_001',
          location: 'Demo Pharmacy, Test City'
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const drugInfo: DrugInfo = {
          batchId: result.batchId,
          drugName: result.metadata?.drugName || 'Unknown Drug',
          manufacturer: result.metadata?.manufacturer || 'Unknown Manufacturer',
          expiryDate: result.metadata?.expiryDate || 'Unknown',
          dosage: result.metadata?.dosage || 'Unknown',
          status: result.isValid ? 'genuine' : 'fake',
          verificationTime: new Date().toLocaleString(),
          blockchainTx: result.transactionHash
        };
        
        setDrugInfo(drugInfo);
        setVerificationStatus(result.isValid ? 'verified' : 'fake');
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
    }
  };

  const handleManualVerify = () => {
    if (manualId.trim()) {
      handleScan(manualId.trim());
    }
  };

  const resetVerification = () => {
    setVerificationStatus('idle');
    setDrugInfo(null);
    setManualId('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Testnet Indicator */}
        <TestnetIndicator />
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Drug Verification</h1>
          <p className="text-xl text-muted-foreground">
            Scan QR codes or enter batch IDs to verify drug authenticity on Cardano testnet
          </p>
        </div>

        {/* Verification Methods */}
        {verificationStatus === 'idle' && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* QR Scanner Card */}
            <Card className="verification-card cursor-pointer hover:shadow-lg transition-all">
              <CardHeader className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Scan QR Code</CardTitle>
                <CardDescription>
                  Use your device camera to scan the QR code on the drug package
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  size="lg"
                  variant={isMockMode ? "secondary" : "default"}
                  onClick={() => setShowScanner(true)}
                >
                  <Scan className="mr-2" />
                  {isMockMode ? "Simulate Scan" : "Start Scanning"}
                </Button>
              </CardContent>
            </Card>

            {/* Manual Entry Card */}
            <Card className="verification-card">
              <CardHeader className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>
                  Enter the batch ID manually if QR code is not available
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Enter Batch ID (e.g., TEST_GENUINE_1)"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                />
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleManualVerify}
                  disabled={!manualId.trim()}
                >
                  <Search className="mr-2" />
                  Verify Batch
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* QR Scanner Modal */}
        {showScanner && (
          <QrScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        )}

        {/* Scanning Status */}
        {verificationStatus === 'scanning' && (
          <Card className="mb-8">
            <CardContent className="text-center py-12">
              <div className="relative mb-6">
                <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Verifying with Cardano Testnet...</h3>
              <p className="text-muted-foreground">
                Checking drug authenticity against blockchain records
              </p>
            </CardContent>
          </Card>
        )}

        {/* Verification Result */}
        {(verificationStatus === 'verified' || verificationStatus === 'fake') && drugInfo && (
          <VerificationResult 
            drugInfo={drugInfo}
            onReset={resetVerification}
          />
        )}

        {/* Error State */}
        {verificationStatus === 'error' && (
          <Card className="border-red-200 bg-red-50 mb-8">
            <CardContent className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2 text-red-800">Verification Failed</h3>
              <p className="text-red-600 mb-4">
                Unable to verify the batch. Please check your connection and try again.
              </p>
              <Button onClick={resetVerification} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Quick Tips */}
        {verificationStatus === 'idle' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                Quick Tips for Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-0.5">1</Badge>
                <p className="text-sm">Try these test batch IDs: <code className="bg-gray-100 px-1 rounded">TEST_GENUINE_1</code>, <code className="bg-gray-100 px-1 rounded">TEST_FAKE_1</code></p>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-0.5">2</Badge>
                <p className="text-sm">All verifications are performed on Cardano testnet (no real ADA required)</p>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-0.5">3</Badge>
                <p className="text-sm">QR scanner will simulate detection for demo purposes</p>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="mt-0.5">4</Badge>
                <p className="text-sm">All verification attempts are logged for analytics</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}