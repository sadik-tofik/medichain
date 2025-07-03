import { NextRequest, NextResponse } from 'next/server';
import { verifyDrugBatch } from '@/lib/cardano';
import { prisma } from '@/lib/prisma';

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
        { error: 'Batch not found in our records' },
        { status: 404 }
      );
    }

    // Verify against Cardano testnet
    const verificationResult = await verifyDrugBatch(batchId);
    
    // Store verification attempt in database
    const verification = await prisma.verification.create({
      data: {
        batchId,
        isGenuine: verificationResult.isValid,
        pharmacyId: pharmacyId || null,
        location: location || null
      }
    });
    
    console.log(`Verification attempt: ${batchId} - ${verificationResult.isValid ? 'VALID' : 'INVALID'}`);
    
    return NextResponse.json({
      batchId,
      isValid: verificationResult.isValid,
      metadata: verificationResult.metadata || batch,
      transactionHash: verificationResult.transactionHash,
      timestamp: verificationResult.timestamp || new Date().toISOString(),
      verificationId: verification.id
    });
    
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    );
  }
}