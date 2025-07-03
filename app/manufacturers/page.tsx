'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TestnetIndicator from '@/components/TestnetIndicator';
import { Building2, Plus, Package, Calendar, Hash, CheckCircle, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface BatchForm {
  drugName: string;
  dosage: string;
  quantity: number;
  expiryDate: string;
  manufacturingDate: string;
  description: string;
  category: string;
}

interface MintedBatch {
  id: string;
  drugName: string;
  dosage: string;
  quantity: number;
  expiryDate: string;
  batchId: string;
  mintedAt: string;
  status: 'minting' | 'minted' | 'distributed';
  nftId?: string;
}

export default function ManufacturersPage() {
  const [mintedBatches, setMintedBatches] = useState<MintedBatch[]>([
    {
      id: '1',
      drugName: 'Paracetamol 500mg',
      dosage: '500mg',
      quantity: 10000,
      expiryDate: '2025-12-31',
      batchId: 'TEST_GENUINE_1',
      mintedAt: '2024-01-15 10:30',
      status: 'distributed',
      nftId: 'nft_abc123def456'
    },
    {
      id: '2',
      drugName: 'Ibuprofen 200mg',
      dosage: '200mg',
      quantity: 5000,
      expiryDate: '2025-06-30',
      batchId: 'TEST_GENUINE_2',
      mintedAt: '2024-01-14 14:20',
      status: 'minted',
      nftId: 'nft_ghi789jkl012'
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BatchForm>();

  const onSubmit = async (data: BatchForm) => {
    setIsSubmitting(true);
    
    try {
      // Generate batch ID
      const batchId = `TEST_GENUINE_${Date.now().toString().slice(-6)}`;
      
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          batchId,
          manufacturer: 'Demo Manufacturer Ltd.',
          verified: true
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const newBatch: MintedBatch = {
          id: Date.now().toString(),
          drugName: data.drugName,
          dosage: data.dosage,
          quantity: data.quantity,
          expiryDate: data.expiryDate,
          batchId: result.batchId,
          mintedAt: new Date().toLocaleString(),
          status: 'minted',
          nftId: result.nftId
        };

        setMintedBatches(prev => [newBatch, ...prev]);
        reset();
      } else {
        console.error('Minting failed:', result.error);
      }
    } catch (error) {
      console.error('Minting error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'minting': return 'bg-yellow-100 text-yellow-800';
      case 'minted': return 'bg-green-100 text-green-800';
      case 'distributed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'minting': return <Clock className="w-4 h-4" />;
      case 'minted': return <CheckCircle className="w-4 h-4" />;
      case 'distributed': return <Package className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Testnet Indicator */}
        <TestnetIndicator />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center">
            <Building2 className="w-10 h-10 mr-4 text-primary" />
            Manufacturer Portal
          </h1>
          <p className="text-xl text-muted-foreground">
            Mint NFTs for drug batches on Cardano testnet and manage your pharmaceutical supply chain
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mint New Batch */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Mint New Drug Batch
                </CardTitle>
                <CardDescription>
                  Create a new NFT for your drug batch on the Cardano testnet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="drugName">Drug Name *</Label>
                      <Input
                        id="drugName"
                        {...register('drugName', { required: 'Drug name is required' })}
                        placeholder="e.g., Paracetamol 500mg"
                      />
                      {errors.drugName && (
                        <p className="text-sm text-red-600 mt-1">{errors.drugName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="dosage">Dosage *</Label>
                      <Input
                        id="dosage"
                        {...register('dosage', { required: 'Dosage is required' })}
                        placeholder="e.g., 500mg"
                      />
                      {errors.dosage && (
                        <p className="text-sm text-red-600 mt-1">{errors.dosage.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        {...register('quantity', { 
                          required: 'Quantity is required',
                          min: { value: 1, message: 'Minimum quantity is 1' }
                        })}
                        placeholder="10000"
                      />
                      {errors.quantity && (
                        <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="analgesic">Analgesic</SelectItem>
                          <SelectItem value="antibiotic">Antibiotic</SelectItem>
                          <SelectItem value="antiviral">Antiviral</SelectItem>
                          <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                          <SelectItem value="diabetes">Diabetes</SelectItem>
                          <SelectItem value="respiratory">Respiratory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="manufacturingDate">Manufacturing Date *</Label>
                      <Input
                        id="manufacturingDate"
                        type="date"
                        {...register('manufacturingDate', { required: 'Manufacturing date is required' })}
                      />
                      {errors.manufacturingDate && (
                        <p className="text-sm text-red-600 mt-1">{errors.manufacturingDate.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        {...register('expiryDate', { required: 'Expiry date is required' })}
                      />
                      {errors.expiryDate && (
                        <p className="text-sm text-red-600 mt-1">{errors.expiryDate.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register('description')}
                      placeholder="Additional information about the batch..."
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <h4 className="font-semibold mb-2">Testnet Blockchain Details</h4>
                    <ul className="text-sm space-y-1 text-orange-800">
                      <li>• NFT will be minted on Cardano testnet (preprod)</li>
                      <li>• No real ADA required - using test tokens</li>
                      <li>• Minting time: ~30 seconds (simulated)</li>
                      <li>• QR codes will be generated automatically</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Minting NFT on Testnet...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Mint Drug Batch NFT
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Batches */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Recent Batches
                </CardTitle>
                <CardDescription>
                  View and manage your recently minted drug batches on testnet
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mintedBatches.map((batch) => (
                    <div key={batch.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold">{batch.drugName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {batch.quantity.toLocaleString()} units • {batch.dosage}
                          </p>
                        </div>
                        <Badge className={getStatusColor(batch.status)}>
                          <div className="flex items-center">
                            {getStatusIcon(batch.status)}
                            <span className="ml-1 capitalize">{batch.status}</span>
                          </div>
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Batch ID:</span>
                          <p className="font-mono">{batch.batchId}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expiry:</span>
                          <p>{batch.expiryDate}</p>
                        </div>
                      </div>

                      {batch.nftId && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">NFT ID:</span>
                          <p className="font-mono text-xs">{batch.nftId}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-xs text-muted-foreground">
                          Minted: {batch.mintedAt}
                        </span>
                        {batch.status === 'minted' && (
                          <Button size="sm" variant="outline">
                            Generate Labels
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}