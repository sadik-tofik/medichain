import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import { LucideAlertCircle } from 'lucide-react';

// Cardano blockchain integration utilities
// This integrates with Blockfrost API for Cardano testnet

export interface BlockchainVerificationResult {
  isValid: boolean;
  nftExists: boolean;
  metadata: any;
  transactionHash?: string;
  blockHeight?: number;
  timestamp?: string;
  error?: string;
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

// Initialize Blockfrost API for testnet
const getBlockfrostAPI = (): BlockFrostAPI | null => {
  const projectId = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;
  const network = process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'preprod';
  
  if (!projectId) {
    console.warn('BLOCKFROST_PROJECT_ID not found, using mock mode');
    return null;
  }
  
  return new BlockFrostAPI({
    projectId,
    network: network as 'preprod' | 'mainnet',
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
  // Check if we're in testnet mode
  const isTestnetMode = process.env.NEXT_PUBLIC_TESTNET_MODE === 'true';
  const api = getBlockfrostAPI();
  
  if (!isTestnetMode || !api) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
    return mockVerify(batchId);
  }
  
  try {
    console.log(`Verifying batch ${batchId} on testnet...`);
    
    // In a real implementation, you would:
    // 1. Query the asset by policy ID + asset name
    // 2. Verify the metadata matches the batch
    // 3. Check if the asset exists and is valid
    
    // For now, we'll simulate a real verification
    const response = await api.assetsById(batchId);
    
    if (response && response.asset) {
      return {
        isValid: true,
        nftExists: true,
        metadata: response.onchain_metadata || {},
        transactionHash: response.initial_mint_tx_hash,
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      isValid: false,
      nftExists: false,
      metadata: null,
      error: 'Batch not found on blockchain'
    };
    
  } catch (error: any) {
    console.error('Blockfrost API error:', error);
    
    // If it's a 404, the asset doesn't exist
    if (error.status_code === 404) {
      return {
        isValid: false,
        nftExists: false,
        metadata: null,
        error: 'Batch not found on blockchain'
      };
    }
    
    // For other errors, return the error
    return {
      isValid: false,
      nftExists: false,
      metadata: null,
      error: `Verification failed: ${error.message}`
    };
  }
}

export async function mintDrugBatchNFT(metadata: DrugBatchMetadata): Promise<{
  success: boolean;
  nftId?: string;
  transactionHash?: string;
  error?: string;
}> {
  try {
    const api = getBlockfrostAPI();
    const isTestnetMode = process.env.NEXT_PUBLIC_TESTNET_MODE === 'true';
    
    // Check if we're in development mode or Blockfrost API is not available
    if (!isTestnetMode || !api) {
      // Mock response for development
      await new Promise(resolve => setTimeout(resolve, 1500));
      return {
        success: true,
        nftId: `mocked-nft-${Date.now()}`,
        transactionHash: `tx_${Math.random().toString(36).substr(2, 9)}`
      };
    }

    // Check if wallet is connected
    if (typeof window === 'undefined' || !(window as any).cardano?.eternl) {
      throw new Error('Eternl wallet is not connected');
    }

    // Initialize the wallet
    const wallet = await (window as any).cardano.eternl.enable();
    
    // Get the wallet's change address
    const usedAddresses = await wallet.getUsedAddresses();
    if (!usedAddresses || usedAddresses.length === 0) {
      throw new Error('No addresses found in wallet');
    }
    const changeAddress = usedAddresses[0];

    // Get the network ID (0 = testnet, 1 = mainnet)
    const networkId = await wallet.getNetworkId();
    
    // Generate a unique asset name from the batch ID
    const assetName = Buffer.from(metadata.batchId).toString('hex');
    
    // Create the asset metadata
    const assetMetadata = {
      [assetName]: {
        name: `MediChain - ${metadata.drugName}`,
        image: 'ipfs://Qm...', // You'll need to upload an image to IPFS
        description: `Pharmaceutical batch ${metadata.batchId}`,
        type: 'Pharmaceutical',
        properties: {
          drugName: metadata.drugName,
          manufacturer: metadata.manufacturer,
          batchId: metadata.batchId,
          expiryDate: metadata.expiryDate,
          dosage: metadata.dosage,
          quantity: metadata.quantity,
          manufacturingDate: metadata.manufacturingDate,
          verified: true
        }
      }
    };

    // Create the minting transaction
    const tx = {
      inputs: [{
        type: 'pubkey',
        data: { hash: changeAddress }
      }],
      outputs: [{
        address: changeAddress,
        amount: { lovelace: '1500000' } // 1.5 ADA for min ADA + fees
      }],
      mint: [{
        action: 'mint',
        amount: '1',
        asset: {
          policyId: 'YOUR_POLICY_ID', // You need to create a policy ID
          assetName: assetName
        },
        metadata: assetMetadata[assetName]
      }],
      metadata: {
        721: assetMetadata
      },
      validityInterval: {
        invalidBefore: null,
        invalidHereafter: null
      }
    };

    // Sign and submit the transaction
    const signedTx = await wallet.signTx(tx, true);
    const txHash = await wallet.submitTx(signedTx);
    
    // Wait for transaction confirmation
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    while (attempts < maxAttempts) {
      try {
        const txInfo = await api.txs(txHash);
        if (txInfo && txInfo.block) {
          return {
            success: true,
            nftId: `${'YOUR_POLICY_ID'}${assetName}`,
            transactionHash: txHash
          };
        }
      } catch (error) {
        // Transaction not found yet, wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
    }
    
    throw new Error('Transaction not confirmed after 30 seconds');
    
  } catch (error) {
    console.error('Error minting NFT:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mint NFT'
    };
  }
}

export function generateQRCodeData(batchId: string, nftId: string): string {
  const network = process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'preprod';
  const verifyUrl = network === 'mainnet' 
    ? `https://cardanoscan.io/token/${nftId}`
    : `https://${network}.cardanoscan.io/token/${nftId}`;
    
  return JSON.stringify({
    batchId,
    nftId,
    verifyUrl,
    timestamp: Date.now(),
    network
  });
}

// Blockfrost API configuration
export const BLOCKFROST_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID || '',
  network: process.env.NEXT_PUBLIC_CARDANO_NETWORK || 'preprod',
  baseUrl: process.env.NEXT_PUBLIC_CARDANO_NETWORK === 'mainnet' 
    ? 'https://cardano-mainnet.blockfrost.io/api/v0'
    : 'https://cardano-preprod.blockfrost.io/api/v0'
};

// Helper function to check if testnet is properly configured
export function isTestnetConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_TESTNET_MODE === 'true' &&
    process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID &&
    process.env.NEXT_PUBLIC_TESTNET_WALLET_ADDRESS
  );
}

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