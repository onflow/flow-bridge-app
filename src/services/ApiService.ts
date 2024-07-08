// src/services/ApiService.ts
import {
  setSourceNetwork,
  setDestinationNetwork,
  setTokenBalances,
  setBridgeRate,
  setFee,
  setEstimatedTimeOfArrival,
} from '../store';

interface Network {
  name: string;
  icon: string;
}

const sourceNetworks: Network[] = [
  { name: 'Flow Mainnet', icon: '/src/assets/flow.png' },
  { name: 'Ethereum Mainnet', icon: '/src/assets/ethereum.png' },
  { name: 'BNB Chain', icon: '/src/assets/bnb.png' },
];

const networkDestinations: Record<string, Network[]> = {
  'Flow Mainnet': [
    { name: 'Ethereum Mainnet', icon: '/src/assets/ethereum.png' },
    { name: 'BNB Chain', icon: '/src/assets/bnb.png' },
  ],
  'Ethereum Mainnet': [
    { name: 'Flow Mainnet', icon: '/src/assets/flow.png' },
    { name: 'BNB Chain', icon: '/src/assets/bnb.png' },
  ],
  'BNB Chain': [
    { name: 'Flow Mainnet', icon: '/src/assets/flow.png' },
    { name: 'Ethereum Mainnet', icon: '/src/assets/ethereum.png' },
  ],
};

class ApiService {
  getSourceNetworks(): Network[] {
    return sourceNetworks;
  }

  getDestinationNetworks(sourceNetwork: string): Network[] {
    return networkDestinations[sourceNetwork] || [];
  }

  getBridgeRate(sourceNetwork: string, destinationNetwork: string, amount: string): string {
    // Stubbed bridge rate
    return `1 ${amount} USDC on ${sourceNetwork} = ${amount} USDC on ${destinationNetwork}`;
  }

  getFee(sourceNetwork: string, destinationNetwork: string, amount: string): string {
    // convert amount to a number and add a 1% fee
    const fAmount = parseFloat(amount);
    return `${(fAmount) * 0.01} USDC`; // 1% fee
  }

  getEstimatedTimeOfArrival(): string {
    // Stubbed ETA
    return '10 minutes';
  }

  updateStoreForBridge(sourceNetwork: string, destinationNetwork: string, amount: string) {
    setSourceNetwork(sourceNetwork);
    setDestinationNetwork(destinationNetwork);
    setBridgeRate(this.getBridgeRate(sourceNetwork, destinationNetwork, amount));
    setFee(this.getFee(sourceNetwork, destinationNetwork, amount));
    setEstimatedTimeOfArrival(this.getEstimatedTimeOfArrival());
    setTokenBalances({ USDC: '1000' }); // Stubbed token balance
  }
}

export default new ApiService();