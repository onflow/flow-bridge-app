# Cross-Chain Bridge Web Application

A Next.js web application that provides a user-friendly interface for cross-chain token bridging and swapping using the [LI.FI Widget](https://github.com/lifinance/widget).

## Purpose

This web application serves as a frontend interface for users to bridge tokens between different blockchain networks without needing to interact directly with smart contracts or command-line tools. It provides access to multiple bridge protocols through LI.FI's aggregation layer, including LayerZero, enabling seamless cross-chain token transfers.

## What This App Does

The application allows users to:

- **Bridge Tokens**: Transfer tokens between different blockchain networks (Ethereum, Flow, Arbitrum, Base, Polygon, etc.)
- **Swap & Bridge**: Swap tokens and bridge in a single transaction
- **Compare Routes**: View and compare different bridge routes with estimated fees and transaction times
- **Connect Wallets**: Support for multiple wallet providers including MetaMask, WalletConnect, Coinbase Wallet, and more
- **Track Transactions**: Monitor cross-chain transaction status in real-time

## Features

- Simple and clean interface
- Default LI.FI Widget theme
- Fully responsive design for mobile and desktop
- Built with Next.js 14 (App Router)
- TypeScript for type safety
- Ready for Vercel deployment

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Bridge Integration**: LI.FI Widget SDK
- **Styling**: CSS3 with custom gradients
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm package manager

### Installation

1. Navigate to the web-app directory:

```bash
cd web-app
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Deploying to Vercel

This application is configured to be deployed on Vercel with the subdirectory setup.

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project" and import your repository
4. Configure the project settings:
   - **Root Directory**: Leave as-is (the root `vercel.json` will handle the subdirectory)
   - **Framework Preset**: Next.js (should auto-detect)
   - **Build Command**: `cd web-app && npm run build`
   - **Install Command**: `cd web-app && npm install`
   - **Output Directory**: `web-app/.next`
5. Click "Deploy"

The root `vercel.json` file is already configured to deploy only the `web-app` directory.

### Method 2: Deploy via Vercel CLI

1. Install Vercel CLI globally:

```bash
npm i -g vercel
```

2. Run the deploy command from the root directory:

```bash
vercel
```

3. Follow the prompts to link your project and deploy

The Vercel CLI will automatically detect the configuration from the root `vercel.json` file.

### Vercel Configuration

The repository includes a `vercel.json` file at the root level that configures Vercel to build and deploy only the `web-app` subdirectory:

```json
{
  "buildCommand": "cd web-app && npm run build",
  "devCommand": "cd web-app && npm run dev",
  "installCommand": "cd web-app && npm install",
  "framework": "nextjs",
  "outputDirectory": "web-app/.next"
}
```

This ensures that only the web application is deployed, while the smart contract implementations in `ethereum-oapp/` and `solana-oapp/` remain as development tools.

## Project Structure

```
web-app/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with widget
│   └── globals.css         # Global styles and theme
├── components/
│   └── LiFiWidget.tsx      # LI.FI Widget wrapper component
├── package.json            # Dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.mjs         # Next.js configuration
├── vercel.json             # Vercel deployment settings
└── README.md               # This file
```

## Customization

### Widget Configuration

To customize the LI.FI Widget behavior, edit `components/LiFiWidget.tsx`:

```typescript
const widgetConfig: WidgetConfig = {
  integrator: 'your-app-name',
  // Add more configuration options here
  // Available options documented at:
  // https://docs.li.fi/integrate-li.fi-sdk/integrate-the-widget
  
  // Example configurations:
  // fromChain: 1,              // Default source chain (Ethereum)
  // toChain: 747,              // Default destination chain (Flow)
  // fromToken: '0x...',        // Default source token
  // toToken: '0x...',          // Default destination token
};
```

### Styling

- **Global styles**: `app/globals.css`
- **Widget container**: `.widget-container` class in `globals.css`
- **Theme**: The app uses a purple gradient background by default
- You can modify colors, layout, and responsive breakpoints in the CSS file

### Supported Chains

The LI.FI Widget supports bridging between numerous blockchain networks including:

- Ethereum
- Flow
- Arbitrum
- Base
- Polygon
- Optimism
- Avalanche
- BNB Chain
- And many more

Users can select any supported chain combination within the widget interface.

## Environment Variables

No environment variables are required for basic functionality. The widget works out-of-the-box with default settings.

Optional environment variables can be added for advanced configurations:

```bash
# Example .env.local file
NEXT_PUBLIC_CUSTOM_RPC_URL=https://...
```

## Learn More

- [LI.FI Widget Documentation](https://docs.li.fi/integrate-li.fi-sdk/integrate-the-widget)
- [LI.FI Widget GitHub Repository](https://github.com/lifinance/widget)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment Documentation](https://nextjs.org/docs/deployment)
- [LayerZero Protocol](https://docs.layerzero.network/)

## Support

For issues with the widget itself, visit the [LI.FI Widget repository](https://github.com/lifinance/widget).

For issues with this web application, please open an issue in the main repository.

## License

MIT
