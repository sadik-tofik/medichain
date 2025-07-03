'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertTriangle, Calendar, Building2, Pill, Hash, Clock, ExternalLink, RefreshCw } from 'lucide-react';

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

interface VerificationResultProps {
  drugInfo: DrugInfo;
  onReset: () => void;
}

export default function VerificationResult({ drugInfo, onReset }: VerificationResultProps) {
  const isGenuine = drugInfo.status === 'genuine';
  
  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className={`border-2 ${isGenuine ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardHeader className="text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isGenuine ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isGenuine ? (
              <CheckCircle className="w-10 h-10 text-green-600" />
            ) : (
              <AlertTriangle className="w-10 h-10 text-red-600" />
            )}
          </div>
          <CardTitle className={`text-2xl ${isGenuine ? 'text-green-800' : 'text-red-800'}`}>
            {isGenuine ? 'GENUINE MEDICATION' : 'COUNTERFEIT DETECTED'}
          </CardTitle>
          <CardDescription className={isGenuine ? 'text-green-700' : 'text-red-700'}>
            {isGenuine 
              ? 'This drug has been verified as authentic on the blockchain' 
              : 'This drug failed blockchain verification - DO NOT USE'
            }
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Drug Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Pill className="w-5 h-5 mr-2" />
            Drug Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Drug Name</label>
              <p className="text-lg font-semibold">{drugInfo.drugName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dosage</label>
              <p className="text-lg font-semibold">{drugInfo.dosage}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Manufacturer</label>
              <p className="text-lg font-semibold flex items-center">
                <Building2 className="w-4 h-4 mr-2" />
                {drugInfo.manufacturer}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
              <p className="text-lg font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {drugInfo.expiryDate}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Batch ID</label>
            <p className="text-lg font-mono font-semibold flex items-center">
              <Hash className="w-4 h-4 mr-2" />
              {drugInfo.batchId}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Blockchain Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Blockchain Verification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Verification Status</span>
            <Badge variant={isGenuine ? "default" : "destructive"}>
              {isGenuine ? 'Verified' : 'Failed'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Verification Time</span>
            <span className="text-sm flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {drugInfo.verificationTime}
            </span>
          </div>
          
          {drugInfo.blockchainTx && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Transaction Hash</span>
              <Button variant="link" size="sm" className="h-auto p-0">
                <span className="font-mono text-xs">{drugInfo.blockchainTx}</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          )}
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {isGenuine ? (
                'This drug has been successfully verified against the Cardano blockchain. The NFT exists and matches the batch information.'
              ) : (
                'This drug could not be verified on the blockchain. It may be counterfeit or the QR code may be damaged.'
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onReset} className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Verify Another Drug
        </Button>
        
        {!isGenuine && (
          <Button variant="destructive" className="flex-1">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Counterfeit
          </Button>
        )}
      </div>

      {/* Additional Actions */}
      {isGenuine && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-2">What's Next?</h4>
            <ul className="text-sm space-y-1 text-blue-800">
              <li>• The medication is safe to use as prescribed</li>
              <li>• Check expiry date before consumption</li>
              <li>• Store according to manufacturer instructions</li>
              <li>• Contact pharmacist for any questions</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}