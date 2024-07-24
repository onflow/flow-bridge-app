import { Wallet, WalletDetailsParams, getWalletConnectConnector } from '@rainbow-me/rainbowkit';
import { DefaultWalletOptions } from '@rainbow-me/rainbowkit/dist/wallets/Wallet';

export type FlowWalletOptions = DefaultWalletOptions;

export const flowWallet = ({ projectId, walletConnectParameters }: FlowWalletOptions): Wallet => {
  return {
    id: 'flow-wallet',
    name: 'Flow Wallet',
    iconUrl: 'https://cdn.prod.website-files.com/64b8433b6f2d35c03d44ffc0/64ca7d6fe695a4527633da1a_Group%2047467.png',
    iconBackground: '#0c2f78',
    downloadUrls: {
      android: 'https://play.google.com/store/apps/details?id=com.flowfoundation.wallet',
      ios: 'https://apps.apple.com/ca/app/flow-wallet-nfts-and-crypto/id6478996750',
      chrome: 'https://chromewebstore.google.com/detail/flow-wallet/hpclkefagolihohboafpheddmmgdffjm',
      qrCode: 'https://wallet.flow.com/download',
    },
    mobile: {
      getUri: (uri: string) => uri,
    },
    qrCode: {
      getUri: (uri: string) => uri,
      instructions: {
        learnMoreUrl: 'https://wallet.flow.com/',
        steps: [
          {
            description:
              'We recommend putting My Wallet on your home screen for faster access to your wallet.',
            step: 'install',
            title: 'Open the Flow Wallet app',
          },
          {
            description:
              'After you scan, a connection prompt will appear for you to connect your wallet.',
            step: 'scan',
            title: 'Tap the scan button',
          },
        ],
      },
    },
    extension: {
      instructions: {
        learnMoreUrl: 'https://wallet.flow.com/',
        steps: [
          {
            description:
              'We recommend pinning Flow Wallet to your taskbar for quicker access to your wallet.',
            step: 'install',
            title: 'Install the Flow Wallet extension',
          },
          {
            description:
              'Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.',
            step: 'create',
            title: 'Create or Import a Wallet',
          },
          {
            description:
              'Once you set up your wallet, click below to refresh the browser and load up the extension.',
            step: 'refresh',
            title: 'Refresh your browser',
          },
        ],
      },
    },

    createConnector: getWalletConnectConnector({
        projectId,
        walletConnectParameters,
      })
  }
}