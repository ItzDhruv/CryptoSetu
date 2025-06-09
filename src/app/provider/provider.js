'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from '../config/config';
import PrivyProvider from '../auth/PrivyProvider';

const queryClient = new QueryClient();

export default function Providers({ children }) {
  return (
    <PrivyProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
