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
} as Partial<WidgetConfig>;

export default function LiFiWidgetComponent() {
  return <LiFiWidget integrator="Flow Bridge" config={widgetConfig} />;
}
