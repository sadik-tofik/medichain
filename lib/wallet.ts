import { BlockfrostProvider } from '@meshsdk/core';

// Simple configuration that will be used by Mesh
export function getMeshWalletOptions() {
  return {
    wallets: {
      // Enable Eternl wallet
      eternl: {
        name: 'Eternl',
        icon: `<svg>...</svg>`, // Add appropriate icon
        wallet: window.cardano?.eternl,
      },
      // Add more wallets here if needed
    },
  };
}

// Add Blockfrost provider configuration
export const blockfrostProvider = new BlockfrostProvider(
  'preprodBw1gAEhjDd7V24hAqiNqZZZmyv3xwaUe' // Your Blockfrost API key
);

// Helper function to get the Eternl wallet API
export async function getEternlApi() {
  console.log('Checking for Eternl wallet...');
  
  if (typeof window === 'undefined') {
    throw new Error('Window is not defined. Make sure this is running in a browser.');
  }
  
  if (!window.cardano) {
    throw new Error('Cardano object not found. Make sure a Cardano wallet extension is installed.');
  }
  
  if (!window.cardano.eternl) {
    throw new Error('Eternl wallet not found. Please make sure the Eternl extension is installed and enabled.');
  }
  
  try {
    console.log('Enabling Eternl wallet...');
    const api = await window.cardano.eternl.enable();
    
    if (!api) {
      throw new Error('Failed to enable Eternl wallet: No API returned');
    }
    
    console.log('Successfully connected to Eternl wallet');
    return api;
  } catch (error: unknown) {
    console.error('Error in getEternlApi:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to connect to Eternl wallet: ${errorMessage}`);
  }
}