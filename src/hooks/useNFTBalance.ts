/**
 * Hook for reading NFT balances from the blockchain
 * Uses wagmi for on-chain data fetching
 */

import { useAccount, useReadContract, useReadContracts } from 'wagmi';
import { useMemo } from 'react';
import { getContractAddress } from '@/config/contracts';
import { polygonAmoy } from 'wagmi/chains';

// ERC-1155 ABI for balance queries
const ERC1155_ABI = [
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
] as const;

interface UseNFTBalanceReturn {
  balance: bigint | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Get balance of a single sticker NFT
 */
export function useNFTBalance(stickerId: number): UseNFTBalanceReturn {
  const { address, chain } = useAccount();
  const contracts = getContractAddress(chain?.id || polygonAmoy.id);

  const { data, isLoading, error, refetch } = useReadContract({
    address: contracts.stickers,
    abi: ERC1155_ABI,
    functionName: 'balanceOf',
    args: address ? [address, BigInt(stickerId)] : undefined,
    query: {
      enabled: !!address && contracts.stickers !== '0x0000000000000000000000000000000000000000',
    },
  });

  return {
    balance: data,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

interface UseBatchNFTBalanceReturn {
  balances: Record<number, bigint>;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Get balances of multiple sticker NFTs in a single call
 */
export function useBatchNFTBalance(stickerIds: number[]): UseBatchNFTBalanceReturn {
  const { address, chain } = useAccount();
  const contracts = getContractAddress(chain?.id || polygonAmoy.id);

  // Create batch query for all sticker IDs
  const contractCalls = useMemo(() => {
    if (!address || !stickerIds.length) return [];
    
    return stickerIds.map((id) => ({
      address: contracts.stickers,
      abi: ERC1155_ABI,
      functionName: 'balanceOf' as const,
      args: [address, BigInt(id)] as const,
    }));
  }, [address, stickerIds, contracts.stickers]);

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: contractCalls,
    query: {
      enabled: !!address && 
        contractCalls.length > 0 && 
        contracts.stickers !== '0x0000000000000000000000000000000000000000',
    },
  });

  // Map results to sticker IDs
  const balances = useMemo(() => {
    const result: Record<number, bigint> = {};
    
    if (data) {
      stickerIds.forEach((id, index) => {
        const balance = data[index]?.result;
        if (typeof balance === 'bigint') {
          result[id] = balance;
        }
      });
    }
    
    return result;
  }, [data, stickerIds]);

  return {
    balances,
    isLoading,
    error: error as Error | null,
    refetch,
  };
}

/**
 * Get all sticker balances for the connected wallet
 * Queries Season 1 (1-300) and OG (1001-1050) stickers
 */
export function useAllNFTBalances() {
  const season1Ids = useMemo(() => 
    Array.from({ length: 300 }, (_, i) => i + 1), 
    []
  );
  const ogIds = useMemo(() => 
    Array.from({ length: 50 }, (_, i) => i + 1001), 
    []
  );

  const season1Balances = useBatchNFTBalance(season1Ids);
  const ogBalances = useBatchNFTBalance(ogIds);

  const allBalances = useMemo(() => ({
    ...season1Balances.balances,
    ...ogBalances.balances,
  }), [season1Balances.balances, ogBalances.balances]);

  return {
    balances: allBalances,
    isLoading: season1Balances.isLoading || ogBalances.isLoading,
    error: season1Balances.error || ogBalances.error,
    refetch: () => {
      season1Balances.refetch();
      ogBalances.refetch();
    },
  };
}

/**
 * Get metadata URI for a sticker
 */
export function useNFTMetadataUri(stickerId: number) {
  const { chain } = useAccount();
  const contracts = getContractAddress(chain?.id || polygonAmoy.id);

  const { data, isLoading, error } = useReadContract({
    address: contracts.stickers,
    abi: ERC1155_ABI,
    functionName: 'uri',
    args: [BigInt(stickerId)],
    query: {
      enabled: contracts.stickers !== '0x0000000000000000000000000000000000000000',
    },
  });

  return {
    uri: data,
    isLoading,
    error: error as Error | null,
  };
}
