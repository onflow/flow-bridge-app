'use client';

import { useMemo } from 'react';
import { LiFiWidget, type WidgetConfig } from '@lifi/widget';

export default function LiFiWidgetComponent() {
  // Enable analytics tracking (single line - all logic is in the hook)
  useWidgetAnalytics();

  const widgetConfig: Partial<WidgetConfig> = useMemo(() => ({
    variant: 'wide',
    subvariant: 'split',
    appearance: 'system',
    theme: {
      palette: {
        primary: {
          main: '#00EF8B',
        },
        secondary: {
          main: '#00D4A1',
        },
      },
      shape: {
        borderRadius: 16,
        borderRadiusSecondary: 12,
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
      },
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '24px',
      },
    },
    fromChain: 1,  // Ethereum Mainnet
    toChain: 747,  // Flow
    fromToken: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC on Ethereum
    toToken: "0xF1815bd50389c46847f0Bda824eC8da914045D14", // stgUSDC on Flow
    // WalletConnect configuration - get your project ID from https://cloud.walletconnect.com
    walletConfig: {
      walletConnect: {
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
      },
    },
  }), []);

  return <LiFiWidget integrator="Flow Bridge" config={widgetConfig} />;
}
