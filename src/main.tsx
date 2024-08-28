// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { createConfig, WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  avalanche,
  flowPreviewnet,
  flowTestnet,
  arbitrumSepolia,
  optimismSepolia,
  sepolia,
  blastSepolia,
  baseSepolia,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { flowDarkTheme } from "./FlowDarkTheme"; // Import your custom theme
import { InitializationProvider } from "./InitializationContext";
import { metaMaskWallet, rainbowWallet, walletConnectWallet, injectedWallet, coinbaseWallet } from "@rainbow-me/rainbowkit/wallets";
import { flowWallet } from "./flow-wallet";
import { createClient, http } from "viem";

const flow = {
  ...flowTestnet,
  name: "Flow",
  iconUrl: "/assets/flow.png",
};

const PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID
const APP_NAME = "Flow Bridge App"

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [flowWallet, rainbowWallet, metaMaskWallet, walletConnectWallet, injectedWallet, coinbaseWallet],
    },
  ],
  {
    appName: APP_NAME,
    projectId: PROJECT_ID,
  }
);

const config = createConfig({
  connectors,
  chains: [mainnet, polygon, optimism, arbitrum, base, avalanche, flow],
  client({chain}) {
    return createClient({chain, transport: http()})
  },
  multiInjectedProviderDiscovery: true,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            showRecentTransactions={true}
            theme={flowDarkTheme}
          >
            <InitializationProvider>
              <App />
            </InitializationProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Router>
  </React.StrictMode>
);
