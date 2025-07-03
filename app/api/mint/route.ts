import { NextRequest, NextResponse } from 'next/server';
import { mintDrugBatchNFT, DrugBatchMetadata } from '@/lib/cardano';
import { prisma } from '@/lib/prisma';
import { blockfrostProvider } from '@/lib/wallet';
import { Transaction } from '@meshdw/core';

// Service fee in lovelace (2 ADA)
const SERVICE_FEE = 2_000_000;
const SERVICE_WALLET = process.env.SERVICE_WALLET_ADDRESS;

if (!SERVICE_WALLET) {
  throw new Error('SERVICE_WALLET_ADDRESS environment variable is not set');
}

interface MintRequest extends DrugBatchMetadata {
  manufacturingDate: string;
  quantity: number;
  userAddress: string; // User's wallet address for receiving the NFT
}

export async function POST(request: NextRequest) {
  try {
    const batchData = await request.json() as MintRequest;
    
    // Validate required fields
    const requiredFields = [
      'drugName', 'manufacturer', 'batchId', 'expiryDate', 
      'dosage', 'quantity', 'manufacturingDate', 'userAddress'
    ];
    
    for (const field of requiredFields) {
      if (!batchData[field as keyof typeof batchData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if batch already exists
    const existingBatch = await prisma.batch.findUnique({
      where: { batchId: batchData.batchId }
    });

    if (existingBatch) {
      return NextResponse.json(
        { error: 'Batch ID already exists' },
        { status: 409 }
      );
    }

    // Create transaction with service fee
    const tx = new Transaction({ initiator: blockfrostProvider })
      .sendLovelace(
        { address: SERVICE_WALLET! },
        SERVICE_FEE.toString()
      );

    // Mint NFT on Cardano testnet with the transaction
    const mintResult = await mintDrugBatchNFT({
      ...batchData,
      transaction: tx // Pass the transaction to add the minting operation
    });
    
    if (!mintResult.success) {
      return NextResponse.json(
        { 
          error: mintResult.error || 'Minting failed',
          details: mintResult.details
        },
        { status: 500 }
      );
    }
    
    // Store batch info in database
    const batch = await prisma.batch.create({
      data: {
        batchId: batchData.batchId,
        drugName: batchData.drugName,
        manufacturer: batchData.manufacturer,
        dosage: batchData.dosage,
        quantity: Number(batchData.quantity),
        expiryDate: new Date(batchData.expiryDate),
        manufacturingDate: new Date(batchData.manufacturingDate),
        nftId: mintResult.nftId,
        cardanoAssetId: mintResult.assetId,
        transactionHash: mintResult.transactionHash,
        serviceFee: SERVICE_FEE.toString(),
        serviceWallet: SERVICE_WALLET
      }
    });
    
    console.log(`NFT minted and stored: ${mintResult.nftId} for batch ${batchData.batchId}`);
    
    return NextResponse.json({
      success: true,
      nftId: mintResult.nftId,
      transactionHash: mintResult.transactionHash,
      batchId: batchData.batchId,
      serviceFee: (SERVICE_FEE / 1_000_000) + ' ADA',
      batch
    });
    
  } catch (error) {
    console.error('Minting error:', error);
    return NextResponse.json(
      { 
        error: 'Minting failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}