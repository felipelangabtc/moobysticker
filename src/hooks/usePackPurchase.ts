/**
 * Hook for purchasing packs on Polygon blockchain
 * Handles real POL transactions on Amoy testnet
 */

import { useState, useCallback } from 'react';
import { useAccount, useSendTransaction, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { polygonAmoy } from 'wagmi/chains';
import { toast } from 'sonner';
import { PACK_CONFIGS, PackType } from '@/data/packs';

// Treasury address to receive pack payments (demo address - replace in production)
const TREASURY_ADDRESS = '0x000000000000000000000000000000000000dEaD' as const;

export type PurchaseStatus = 'idle' | 'switching-chain' | 'confirming' | 'pending' | 'success' | 'error';

interface UsePackPurchaseReturn {
  purchasePack: (packType: PackType) => Promise<boolean>;
  status: PurchaseStatus;
  error: string | null;
  txHash: string | null;
  isProcessing: boolean;
  reset: () => void;
}

export function usePackPurchase(): UsePackPurchaseReturn {
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransactionAsync, data: txHash } = useSendTransaction();
  
  const [status, setStatus] = useState<PurchaseStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [currentTxHash, setCurrentTxHash] = useState<string | null>(null);

  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setCurrentTxHash(null);
  }, []);

  const purchasePack = useCallback(async (packType: PackType): Promise<boolean> => {
    // Validate wallet connection
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      toast.error('Please connect your wallet first');
      return false;
    }

    const pack = PACK_CONFIGS[packType];
    if (!pack) {
      setError('Invalid pack type');
      return false;
    }

    try {
      // Step 1: Ensure we're on Polygon Amoy
      if (chain?.id !== polygonAmoy.id) {
        setStatus('switching-chain');
        toast.loading('Switching to Polygon Amoy...', { id: 'chain-switch' });
        
        try {
          await switchChainAsync({ chainId: polygonAmoy.id });
          toast.success('Switched to Polygon Amoy', { id: 'chain-switch' });
        } catch (switchError: any) {
          toast.error('Failed to switch network', { id: 'chain-switch' });
          setError('Please switch to Polygon Amoy network');
          setStatus('error');
          return false;
        }
      }

      // Step 2: Request user confirmation
      setStatus('confirming');
      toast.loading(`Confirm ${pack.name} purchase (${pack.priceDisplay})...`, { id: 'pack-purchase' });

      // Step 3: Send transaction
      const priceInWei = parseEther(pack.price);
      
      const hash = await sendTransactionAsync({
        to: TREASURY_ADDRESS,
        value: priceInWei,
      });

      setCurrentTxHash(hash);
      setStatus('pending');
      toast.loading('Transaction pending...', { id: 'pack-purchase' });

      // Transaction was sent successfully - the component will handle the rest
      // based on useWaitForTransactionReceipt
      setStatus('success');
      toast.success(`${pack.name} purchased! Opening pack...`, { id: 'pack-purchase' });
      
      return true;
    } catch (err: any) {
      console.error('Pack purchase error:', err);
      
      let errorMessage = 'Transaction failed';
      
      if (err?.message?.includes('rejected')) {
        errorMessage = 'Transaction rejected by user';
      } else if (err?.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient POL balance';
      } else if (err?.message?.includes('gas')) {
        errorMessage = 'Gas estimation failed';
      }
      
      setError(errorMessage);
      setStatus('error');
      toast.error(errorMessage, { id: 'pack-purchase' });
      
      return false;
    }
  }, [isConnected, address, chain, switchChainAsync, sendTransactionAsync]);

  return {
    purchasePack,
    status,
    error,
    txHash: currentTxHash,
    isProcessing: status === 'switching-chain' || status === 'confirming' || status === 'pending',
    reset,
  };
}
