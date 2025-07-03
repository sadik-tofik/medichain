import { NextRequest, NextResponse } from 'next/server';
import { verifyDrugBatch } from '@/lib/cardano';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { batchId, pharmacyId, location } = await request.json();
    
    if (!batchId) {
      return NextResponse.json(
        { error: 'Batch ID is required' },
        { status: 400 }
      );
    }

    // Check if batch exists in our database first
    const batch = await prisma.batch.findUnique({
      where: { batchId }
    });
    
    if (!batch) {
      return NextResponse.json(
        { error: 'Batch not found' },
        { status: 404 }
      );
    }

    // Verify against Cardano testnet
    const verificationResult = await verifyDrugBatch(batchId);
    
    // Store verification attempt in database
    const verification = await prisma.verification.create({
      data: {
        batchId: batchId,
        isGenuine: verificationResult.isValid,
        pharmacyId: pharmacyId || null,
        location: location || null
      },
      include: {
        batch: true
      }
    });
    
    console.log(`Verification attempt: ${batchId} - ${verificationResult.isValid ? 'VALID' : 'INVALID'}`);
    
    return NextResponse.json({
      batchId,
      isValid: verificationResult.isValid,
      metadata: verificationResult.metadata || batch,
      transactionHash: verificationResult.transactionHash,
      timestamp: verificationResult.timestamp,
      verificationId: verification.id
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { error: 'Verification failed', details: errorMessage },
      { status: 500 }
    );
  }
}