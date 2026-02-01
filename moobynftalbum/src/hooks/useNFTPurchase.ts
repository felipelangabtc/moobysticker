/**
 * Hook for purchasing NFT packs via smart contract
 * Handles real blockchain transactions with event listening
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useSwitchChain,
  useWatchContractEvent,
} from 'wagmi';
import { parseEther } from 'viem';
import { polygonAmoy } from 'wagmi/chains';
import { toast } from 'sonner';
import { getContractAddress, STICKER_RANGES } from '@/config/contracts';
import { PackType } from '@/data/packs';

// Pack Contract ABI (minimal for purchases)
const PACK_ABI = [
  {
    name: 'buyPack',
    type: 'function',
    stateMutability: 'payable',
    inputs: [{ name: 'packType', type: 'uint8' }],
    outputs: [],
  },
  {
    name: 'PackPurchased',
    type: 'event',
    inputs: [
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'packType', type: 'uint8', indexed: false },
      { name: 'stickerIds', type: 'uint256[]', indexed: false },
    ],
  },
  {
    name: 'basicPackPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'silverPackPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'goldPackPrice',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const;

// Pack type to contract enum mapping
const PACK_TYPE_MAP: Record<PackType, number> = {
  basic: 0,
  silver: 1,
  gold: 2,
};

// Pack prices in POL (fallback if contract read fails)
const PACK_PRICES: Record<PackType, string> = {
  basic: '0.001',
  silver: '0.002',
  gold: '0.005',
};

export type NFTPurchaseStatus = 
  | 'idle' 
  | 'switching-chain' 
  | 'confirming' 
  | 'pending' 
  | 'waiting-confirmation'
  | 'success' 
  | 'error';

interface UseNFTPurchaseReturn {
  purchasePack: (packType: PackType) => Promise<number[] | null>;
  status: NFTPurchaseStatus;
  error: string | null;
  txHash: `0x${string}` | null;
  mintedStickerIds: number[];
  isProcessing: boolean;
  reset: () => void;
}

export function useNFTPurchase(): UseNFTPurchaseReturn {
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const contracts = getContractAddress(chain?.id || polygonAmoy.id);
  
  const [status, setStatus] = useState<NFTPurchaseStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [mintedStickerIds, setMintedStickerIds] = useState<number[]>([]);

  const { 
    writeContractAsync, 
    data: txHash, 
    isPending: isWritePending,
    reset: resetWrite,
  } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Watch for PackPurchased events to get minted sticker IDs
  useWatchContractEvent({
    address: contracts.stickers,
    abi: PACK_ABI,
    eventName: 'PackPurchased',
    onLogs(logs) {
      if (logs.length > 0 && address) {
        const log = logs[0];
        try {
          // Parse event args directly from log
          const args = log.args as unknown as { buyer?: string; packType?: number; stickerIds?: bigint[] };
          if (args?.buyer?.toLowerCase() === address.toLowerCase() && args.stickerIds) {
            const ids = args.stickerIds.map(id => Number(id));
            console.log('Minted stickers:', ids);
            setMintedStickerIds(ids);
          }
        } catch (e) {
          console.error('Failed to decode event:', e);
        }
      }
    },
    enabled: !!txHash && contracts.stickers !== '0x0000000000000000000000000000000000000000',
  });

  // Update status when transaction confirms
  useEffect(() => {
    if (isConfirmed && receipt) {
      setStatus('success');
      toast.success('NFT Pack purchased! Check your wallet for new stickers.');
    }
  }, [isConfirmed, receipt]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setMintedStickerIds([]);
    resetWrite();
  }, [resetWrite]);

  const purchasePack = useCallback(async (packType: PackType): Promise<number[] | null> => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      toast.error('Please connect your wallet first');
      return null;
    }

    // Check if contract is deployed
    if (contracts.stickers === '0x0000000000000000000000000000000000000000') {
      // Fallback to demo mode
      console.log('Contract not deployed - using demo mode');
      toast.info('Demo mode: Contract not deployed yet. Simulating purchase...');
      
      // Generate mock sticker IDs
      const count = packType === 'basic' ? 3 : packType === 'silver' ? 5 : 7;
      const mockIds: number[] = [];
      while (mockIds.length < count) {
        const id = Math.floor(Math.random() * 300) + 1;
        if (!mockIds.includes(id)) mockIds.push(id);
      }
      
      setMintedStickerIds(mockIds);
      setStatus('success');
      return mockIds;
    }

    try {
      // Step 1: Ensure we're on Polygon Amoy
      if (chain?.id !== polygonAmoy.id) {
        setStatus('switching-chain');
        toast.loading('Switching to Polygon Amoy...', { id: 'nft-purchase' });
        
        try {
          await switchChainAsync({ chainId: polygonAmoy.id });
          toast.success('Switched to Polygon Amoy', { id: 'nft-purchase' });
        } catch (switchError: any) {
          toast.error('Failed to switch network', { id: 'nft-purchase' });
          setError('Please switch to Polygon Amoy network');
          setStatus('error');
          return null;
        }
      }

      // Step 2: Request user confirmation
      setStatus('confirming');
      const price = PACK_PRICES[packType];
      toast.loading(`Confirm purchase (${price} POL)...`, { id: 'nft-purchase' });

      // Step 3: Call smart contract
      const hash = await writeContractAsync({
        address: contracts.stickers,
        abi: PACK_ABI,
        functionName: 'buyPack',
        args: [PACK_TYPE_MAP[packType]],
        value: parseEther(price),
        chain: polygonAmoy,
        account: address,
      });

      setStatus('waiting-confirmation');
      toast.loading('Transaction pending...', { id: 'nft-purchase' });

      // The useWaitForTransactionReceipt will handle confirmation
      // and useWatchContractEvent will capture minted sticker IDs
      
      return null; // IDs will be set via event listener
    } catch (err: any) {
      console.error('NFT purchase error:', err);
      
      let errorMessage = 'Transaction failed';
      
      if (err?.message?.includes('rejected') || err?.message?.includes('denied')) {
        errorMessage = 'Transaction rejected by user';
      } else if (err?.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient POL balance';
      } else if (err?.message?.includes('gas')) {
        errorMessage = 'Gas estimation failed';
      } else if (err?.shortMessage) {
        errorMessage = err.shortMessage;
      }
      
      setError(errorMessage);
      setStatus('error');
      toast.error(errorMessage, { id: 'nft-purchase' });
      
      return null;
    }
  }, [isConnected, address, chain, contracts, switchChainAsync, writeContractAsync]);

  return {
    purchasePack,
    status,
    error,
    txHash: txHash || null,
    mintedStickerIds,
    isProcessing: status === 'switching-chain' || status === 'confirming' || status === 'pending' || status === 'waiting-confirmation' || isWritePending || isConfirming,
    reset,
  };
}
