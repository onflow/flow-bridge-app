/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_WALLET_CONNECT_PROJECT_ID: string
    readonly VITE_FLOW_WALLET_FLAG: string
    readonly VITE_BANNER_TEXT: string
    readonly VITE_GA4_TRACKING_ID: string
    // Add other environment variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }