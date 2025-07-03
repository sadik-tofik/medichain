import { BlockfrostProvider } from '@meshsdk/core';

// Simple configuration that will be used by Mesh
export function getMeshWalletOptions() {
  return [
    'eternl' // Only include Eternl wallet
  ];
}

// Add Blockfrost provider configuration
export const blockfrostProvider = new BlockfrostProvider(
  'preprodBw1gAEhjDd7V24hAqiNqZZZmyv3xwaUe' // Your Blockfrost API key
);

// Helper function to get the Eternl wallet API
export async function getEternlApi() {
  if (typeof window === 'undefined' || !window.cardano?.eternl) {
    throw new Error('Eternl wallet not found');
  }
  
  try {
    const api = await window.cardano.eternl.enable();
    if (!api) {
      throw new Error('Failed to enable Eternl wallet');
    }
    return api;
  } catch (error) {
    console.error('Error getting Eternl API:', error);
    throw new Error('Failed to connect to Eternl wallet');
  }
}