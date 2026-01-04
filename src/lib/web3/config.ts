/**
 * Web3 Provider Configuration
 * Configures wagmi, RainbowKit, and blockchain connections
 */

import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { polygon, polygonAmoy } from 'wagmi/chains';
import { http } from 'wagmi';

// =============================================================================
// CHAIN CONFIGURATION
// =============================================================================

/**
 * Wagmi/RainbowKit configuration
 * Uses environment variables for flexibility
 */
export const wagmiConfig = getDefaultConfig({
  appName: 'NFT Sticker Album',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'demo-project-id',
  chains: [polygon, polygonAmoy],
  transports: {
    [polygon.id]: http(import.meta.env.VITE_POLYGON_RPC_URL || 'https://polygon-rpc.com'),
    [polygonAmoy.id]: http(import.meta.env.VITE_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology'),
  },
});

// =============================================================================
// CONTRACT ABIS (Simplified for demo)
// =============================================================================

/**
 * ERC-1155 Sticker Contract ABI (key functions)
 */
export const STICKER_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'account', type: 'address' },
      { name: 'id', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'balanceOfBatch',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'accounts', type: 'address[]' },
      { name: 'ids', type: 'uint256[]' },
    ],
    outputs: [{ name: '', type: 'uint256[]' }],
  },
  {
    name: 'uri',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [{ name: '', type: 'string' }],
  },
  {
    name: 'TransferSingle',
    type: 'event',
    inputs: [
      { name: 'operator', type: 'address', indexed: true },
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'id', type: 'uint256', indexed: false },
      { name: 'value', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'TransferBatch',
    type: 'event',
    inputs: [
      { name: 'operator', type: 'address', indexed: true },
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'ids', type: 'uint256[]', indexed: false },
      { name: 'values', type: 'uint256[]', indexed: false },
    ],
  },
] as const;

/**
 * Pack Contract ABI (key functions)
 */
export const PACK_ABI = [
  {
    name: 'buyPack',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'packType', type: 'uint8' }],
    outputs: [],
  },
  {
    name: 'openPack',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'packType', type: 'uint8' },
      { name: 'quantity', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    name: 'getPackBalance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'packType', type: 'uint8' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getPackPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'packType', type: 'uint8' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'PackPurchased',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'packType', type: 'uint8', indexed: false },
      { name: 'quantity', type: 'uint256', indexed: false },
    ],
  },
  {
    name: 'PackOpened',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'packType', type: 'uint8', indexed: false },
      { name: 'stickerIds', type: 'uint256[]', indexed: false },
    ],
  },
] as const;

/**
 * Craft Contract ABI (key functions)
 */
export const CRAFT_ABI = [
  {
    name: 'craft',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'inputIds', type: 'uint256[]' },
      { name: 'outputRarity', type: 'uint8' },
    ],
    outputs: [{ name: 'outputId', type: 'uint256' }],
  },
  {
    name: 'Crafted',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'inputIds', type: 'uint256[]', indexed: false },
      { name: 'outputId', type: 'uint256', indexed: false },
    ],
  },
] as const;

/**
 * Rewards Contract ABI (key functions)
 */
export const REWARDS_ABI = [
  {
    name: 'claimReward',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'rewardId', type: 'bytes32' }],
    outputs: [],
  },
  {
    name: 'isRewardClaimed',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'rewardId', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'RewardClaimed',
    type: 'event',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'rewardId', type: 'bytes32', indexed: true },
    ],
  },
] as const;
