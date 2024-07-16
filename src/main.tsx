// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  flowPreviewnet,
} from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { flowDarkTheme } from "./FlowDarkTheme"; // Import your custom theme
import { InitializationProvider } from "./InitializationContext";

const c = {
  ...flowPreviewnet,
  name: "Flow",
  iconUrl: "/src/assets/flow.png",
}

const config = getDefaultConfig({
  appName: "Flow Bridge App",
  projectId: "YOUR_PROJECT_ID",
  chains: [mainnet, polygon, optimism, arbitrum, base, c],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={flowDarkTheme}>
            <InitializationProvider>
              <App />
            </InitializationProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Router>
  </React.StrictMode>
);
