'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

// Define the custom 0G Testnet chain configuration
export const zeroGravityTestnet = {
  id: 16602,
  name: '0G Testnet',
  network: '0g-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'A0GI',
    symbol: 'A0GI',
  },
  rpcUrls: {
    default: { http: ['https://evmrpc-testnet.0g.ai'] },
    public: { http: ['https://evmrpc-testnet.0g.ai'] },
  },
  blockExplorers: {
    default: { name: '0G Scan', url: 'https://scan-testnet.0g.ai' },
  },
};

const config = createConfig({
  chains: [zeroGravityTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [zeroGravityTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
