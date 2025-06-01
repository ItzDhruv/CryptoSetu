'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import {
  mainnet,
  base,
  berachain,
  polygon,
  arbitrum,
  story,
  mantle
} from 'viem/chains';

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const clientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

export default function Providers({ children }) {
  return (
    <PrivyProvider
      appId={appId}
      clientId={clientId}
      config={{
        // Enable embedded wallets
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
        // Set default chain
        defaultChain: base,
        // Configure supported chains
        supportedChains: [mainnet, base, polygon, arbitrum, story, mantle, berachain],
        // Configure wallet connectors
        walletConnectors: {
          // Enable MetaMask and other injected wallets
          injected: {
            enabled: true,
            options: {
              shimDisconnect: true,
              shimChainChanged: true,
            },
          },
          // Enable WalletConnect
          walletConnect: {
            enabled: true,
            options: {
              projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
            },
          },
          // Enable Coinbase Wallet
          coinbaseWallet: {
            enabled: true,
          },
        },
        // Appearance configuration
        appearance: {
          theme: 'dark',
          accentColor: '#FCD34D', // yellow-300
          showWalletLoginFirst: true,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
