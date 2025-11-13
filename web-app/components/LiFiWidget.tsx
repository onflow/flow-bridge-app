'use client';

import { LiFiWidget, type WidgetConfig } from '@lifi/widget';

const widgetConfig = {
  variant: 'wide',
  appearance: 'system' as const,
  theme: {
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#00EF8B',
          },
          secondary: {
            main: '#00D4A1',
          },
          background: {
            paper: '#FFFFFF',
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: '#00EF8B',
          },
          secondary: {
            main: '#00D4A1',
          },
          background: {
            paper: '#1E1E1E',
            default: '#121212',
          },
        },
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
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
} as Partial<WidgetConfig>;

export default function LiFiWidgetComponent() {
  return <LiFiWidget integrator="Flow Bridge" config={widgetConfig} />;
}
