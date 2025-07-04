import { BlockFrostAPI } from '@blockfrost/blockfrost-js';

// Cardano blockchain integration utilities
// This integrates with Blockfrost API for Cardano testnet

export interface BlockchainVerificationResult {
  isValid: boolean;
  nftExists: boolean;
  metadata: any;
  transactionHash?: string;
  blockHeight?: number;
  timestamp?: string;
}

export interface DrugBatchMetadata {
  drugName: string;
  manufacturer: string;
  batchId: string;
  expiryDate: string;
  dosage: string;
  quantity: number;
  manufacturingDate: string;
  verified: boolean;
}

// Initialize Blockfrost API for testnet only
const getBlockfrostAPI = () => {
  const projectId = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
  if (!projectId) {
    console.warn('Blockfrost project ID not found. Using mock mode.');
    return null;
  }
  return new BlockFrostAPI({
    projectId,
    network: 'preprod', // or 'mainnet' for mainnet
  });
};


// Mock function for local development and testing
function mockVerify(batchId: string): BlockchainVerificationResult {
  const isGenuine = batchId.startsWith('TEST_GENUINE_') || 
                   batchId.startsWith('BTC-2024-') ||
                   !batchId.includes('FAKE');
  
  return {
    isValid: isGenuine,
    nftExists: isGenuine,
    metadata: isGenuine ? {
      drugName: 'Paracetamol 500mg',
      manufacturer: 'PharmaCorp Ltd.',
      batchId: batchId,
      expiryDate: '2025-12-31',
      dosage: '500mg tablets',
      quantity: 10000,
      manufacturingDate: '2024-01-15',
      verified: true
    } : null,
    transactionHash: isGenuine ? `tx_${Math.random().toString(36).substr(2, 9)}` : undefined,
    blockHeight: isGenuine ? Math.floor(Math.random() * 1000000) + 8000000 : undefined,
    timestamp: new Date().toISOString()
  };
}

export async function verifyDrugBatch(batchId: string): Promise<BlockchainVerificationResult> {
  // Check if we're in mock mode
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
    return mockVerify(batchId);
  }
  
  const api = getBlockfrostAPI();
  
  if (!api) {
    // Fallback to mock if no API key
    await new Promise(resolve => setTimeout(resolve, 1500));
    return mockVerify(batchId);
  }
  
  try {
    // In a real implementation, you would:
    // 1. Query the asset by policy ID + asset name
    // 2. Verify the metadata matches the batch
    // 3. Check if the asset exists and is valid
    
    // For now, simulate the API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response based on batch ID pattern
    return mockVerify(batchId);
    
  } catch (error) {
    console.error('Blockfrost API error:', error);
    // Fallback to mock on API error
    return mockVerify(batchId);
  }
}

export async function mintDrugBatchNFT(metadata: DrugBatchMetadata): Promise<{
  success: boolean;
  nftId?: string;
  transactionHash?: string;
  error?: string;
}> {
  // Check if we're in mock mode
  if (process.env.NEXT_PUBLIC_MOCK_MODE === 'true') {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      nftId: `nft_${Math.random().toString(36).substr(2, 12)}`,
      transactionHash: `tx_${Math.random().toString(36).substr(2, 9)}`
    };
  }
  
  const api = getBlockfrostAPI();
  
  if (!api) {
    // Fallback to mock if no API key
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      nftId: `nft_${Math.random().toString(36).substr(2, 12)}`,
      transactionHash: `tx_${Math.random().toString(36).substr(2, 9)}`
    };
  }
  
  try {
    // In a real implementation, you would:
    // 1. Create a minting transaction
    // 2. Submit to the testnet
    // 3. Wait for confirmation
    
    // For now, simulate the minting process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const success = Math.random() > 0.05; // 95% success rate
    
    if (success) {
      return {
        success: true,
        nftId: `nft_${Math.random().toString(36).substr(2, 12)}`,
        transactionHash: `tx_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Minting failed: Insufficient test ADA balance'
      };
    }
    
  } catch (error) {
    console.error('Minting error:', error);
    return {
      success: false,
      error: 'Minting failed: Network error'
    };
  }
}

export function generateQRCodeData(batchId: string, nftId: string): string {
  return JSON.stringify({
    batchId,
    nftId,
    verifyUrl: `https://medichain.vercel.app/verify?batch=${batchId}`,
    timestamp: Date.now(),
    network: 'testnet'
  });
}

// Blockfrost API configuration
export const BLOCKFROST_CONFIG = {
  projectId: process.env.BLOCKFROST_TESTNET_KEY || '',
  network: 'preprod', // Always use testnet
  baseUrl: 'https://cardano-preprod.blockfrost.io/api/v0'
};

// Test data for development
export const TEST_BATCHES = [
  {
    batch_id: "TEST_GENUINE_1",
    drug_name: "Amoxicillin 500mg",
    manufacturer: "GSK",
    expiry: "2026-12-31",
    cardano_asset_id: "test_asset_1"
  },
  {
    batch_id: "TEST_GENUINE_2", 
    drug_name: "Paracetamol 500mg",
    manufacturer: "PharmaCorp",
    expiry: "2025-08-15",
    cardano_asset_id: "test_asset_2"
  },
  {
    batch_id: "TEST_FAKE_1",
    drug_name: "Unknown Drug",
    manufacturer: "Unknown",
    expiry: "2020-01-01",
    cardano_asset_id: null
  }
];