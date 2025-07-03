import { NextRequest, NextResponse } from 'next/server';
import { mintDrugBatchNFT, DrugBatchMetadata } from '@/lib/cardano';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const batchData = await request.json() as DrugBatchMetadata & {
      manufacturingDate: string;
      quantity: number;
    };
    
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
        { error: mintResult.error || 'Minting failed' },
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
        quantity: Number(batchData.quantity), // Ensure quantity is a number
        expiryDate: new Date(batchData.expiryDate),
        manufacturingDate: new Date(batchData.manufacturingDate),
        nftId: mintResult.nftId,
        cardanoAssetId: mintResult.transactionHash // Store tx hash as asset reference
      }
    });
    
    console.log(`NFT minted and stored: ${mintResult.nftId} for batch ${batchData.batchId}`);
    
    return NextResponse.json({
      success: true,
      nftId: mintResult.nftId,
      transactionHash: mintResult.transactionHash,
      batchId: batchData.batchId,
      batch: batch
    });
    
  } catch (error) {
    console.error('Minting error:', error);
    return NextResponse.json(
      { error: 'Minting failed' },
      { status: 500 }
    );
  }
}