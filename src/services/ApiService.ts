// src/services/ApiService.ts
import {
  setSourceNetwork,
  setDestinationNetwork,
  setTokenBalances,
  setBridgeRate,
  setFee,
  setEstimatedTimeOfArrival,
  state,
  AppState,
} from "../store";
import { BehaviorSubject } from "rxjs";
import { AxelarService, NetworkInfo } from "./AxelarService";
import { Network } from "hardhat/types";

class ApiService {
  async checkApproval(
    sourceChain: NetworkInfo,
    amount: string
  ): Promise<boolean> {
    if (!amount) return Promise.resolve(false);
    // sleep for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    // TODO: need bridge contract address for source network
    return Promise.resolve(false);
  }

  async setApproval(
    sourceChain: NetworkInfo,
    destinationChain: NetworkInfo,
    amount: string
  ): Promise<void> {
    // sleep for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return Promise.resolve();
  }
  
  async sendTokens(
    sourceChain: NetworkInfo,
    destinatinoChain: NetworkInfo,
    amount: string,
    destinationAddress: string
  ): Promise<void> {
    // sleep for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
    return Promise.resolve();
  }

  async fetchAndSetNetworks(): Promise<NetworkInfo[]> {
    let networks: NetworkInfo[] = [];
    try {
      const axelarService = new AxelarService();
      await axelarService.init();
      const nets = await axelarService.getSupportedNetworks();
      networks = Object.values(nets);
    } catch (error) {
      console.error("Failed to fetch and set networks:", error);
    }
    return networks;
  }

  async getSourceNetworks(): Promise<NetworkInfo[]> {
    const currentState = (state as BehaviorSubject<AppState>).value;
    return Object.values(currentState.networks);
  }

  async getDestinationNetworks(sourceNetwork: string): Promise<NetworkInfo[]> {
    const currentState = (state as BehaviorSubject<AppState>).value;
    return Object.values(currentState.networks) || [];
  }

  getBridgeRate(
    sourceNetwork: NetworkInfo,
    destinationNetwork: NetworkInfo,
    amount: string
  ): string {
    return `1 ${amount} USDC on ${sourceNetwork} = ${amount} USDC on ${destinationNetwork}`;
  }

  getFee(
    sourceNetwork: NetworkInfo,
    destinationNetwork: NetworkInfo,
    amount: string
  ): string {
    const fAmount = parseFloat(amount);
    return `${fAmount * 0.01} USDC`;
  }

  getEstimatedTimeOfArrival(): string {
    return "10 minutes";
  }

  async updateStoreForBridge(
    sourceNetwork: NetworkInfo,
    destinationNetwork: NetworkInfo,
    amount: string
  ) {
    await this.fetchAndSetNetworks();
    setSourceNetwork(sourceNetwork);
    setDestinationNetwork(destinationNetwork);
    setBridgeRate(
      this.getBridgeRate(sourceNetwork, destinationNetwork, amount)
    );
    setFee(this.getFee(sourceNetwork, destinationNetwork, amount));
    setEstimatedTimeOfArrival(this.getEstimatedTimeOfArrival());
    setTokenBalances({ USDC: "1000" });
  }
}

export default new ApiService();
