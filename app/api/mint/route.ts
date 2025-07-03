import { NextRequest, NextResponse } from 'next/server';
import { mintDrugBatchNFT, DrugBatchMetadata } from '@/lib/cardano';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const batchData = await request.json() as DrugBatchMetadata & {
      manufacturingDate: string;
      quantity: number;
    };

    // Convert quantity to number and validate
    const quantity = Number(batchData.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be a positive number' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields = ['drugName', 'manufacturer', 'batchId', 'expiryDate', 'dosage', 'quantity', 'manufacturingDate'];
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

    // Mint NFT on Cardano testnet
    const mintResult = await mintDrugBatchNFT(batchData);
    
    if (!mintResult.success) {
      return NextResponse.json(
        { 
          error: mintResult.error || 'Minting failed',
          details: mintResult.error
        },
        { status: 500 }
      );
    }

    // Save to database
    const batch = await prisma.batch.create({
      data: {
        batchId: batchData.batchId,
        drugName: batchData.drugName,
        manufacturer: batchData.manufacturer,
        expiryDate: new Date(batchData.expiryDate),
        dosage: batchData.dosage,
        quantity: quantity,
        manufacturingDate: new Date(batchData.manufacturingDate),
        nftId: mintResult.nftId,
        transactionHash: mintResult.transactionHash,
        network: process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'preprod'
      }
    });

    return NextResponse.json({
      success: true,
      batchId: batch.batchId,
      nftId: batch.nftId,
      transactionHash: batch.transactionHash
    });

  } catch (error: any) {
    console.error('Minting error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process mint request',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}