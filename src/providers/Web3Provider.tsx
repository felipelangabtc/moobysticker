/**
 * Web3 Provider Component
 * Wraps the app with RainbowKit and wagmi providers for wallet connectivity
 */

import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/web3/config';
import { ReactNode } from 'react';

// Create a query client for TanStack Query (required by wagmi)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    },
  },
});

interface Web3ProviderProps {
  children: ReactNode;
}

/**
 * Web3Provider wraps the application with all necessary providers for Web3 functionality
 * - WagmiProvider: Core wagmi functionality for wallet connections and contract interactions
 * - QueryClientProvider: TanStack Query for caching and state management
 * - RainbowKitProvider: Beautiful wallet connection modal and UI
 */
export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={{
            lightMode: lightTheme({
              accentColor: '#D4AF37', // Gold accent to match album theme
              accentColorForeground: 'white',
              borderRadius: 'medium',
              fontStack: 'system',
            }),
            darkMode: darkTheme({
              accentColor: '#D4AF37',
              accentColorForeground: 'white',
              borderRadius: 'medium',
              fontStack: 'system',
            }),
          }}
          modalSize="compact"
          appInfo={{
            appName: 'NFT Sticker Album',
            learnMoreUrl: 'https://polygon.technology/',
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
