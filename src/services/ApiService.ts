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
import {
  AxelarAssetTransfer,
  Environment,
  // @ts-ignore
  SendTokenParams,
} from "@axelar-network/axelarjs-sdk";
import { parseUnits } from "viem";
import { ethers } from "ethers";

export type Asset = {
  denom: string;
  decimals: number;
};

const FLOW_RPC_ENDPOINT = "https://previewnet.evm.nodes.onflow.org";

import { AxelarService, NetworkInfo, TokenConfig } from "./AxelarService";
import { readContract } from "viem/actions";
import { formatUnits } from "viem";

const BalanceOfAbi = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
];
class ApiService {
  // create global instance of AxelarService
  private axelarService = new AxelarService();
  public DefaultToken: string = "uusdc";

  private provider = new ethers.providers.JsonRpcProvider(FLOW_RPC_ENDPOINT);
  private assetTransfer = new AxelarAssetTransfer({
    environment: Environment.MAINNET,
  });

  constructor() {
    console.log("ApiService constructor");
  }

  public isInitialized(): boolean {
    return this.axelarService.isInitialized();
  }

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
    destinationAddress: string,
    token: TokenConfig,
    amount: string
  ): Promise<ethers.providers.TransactionResponse> {
    const amountInAtomicUnits = parseUnits(
      amount.toString(),
      token.decimals
    ).toString();
    const signer = this.provider.getSigner();
    const requestOptions: SendTokenParams = {
      fromChain: sourceChain.name,
      toChain: destinatinoChain.name,
      destinationAddress,
      asset: { denom: token.denom },
      amountInAtomicUnits,
      options: {
        evmOptions: {
          signer,
          provider: this.provider,
          approveSendForMe: true,
        },
      },
    };
    // @ts-ignore
    const result = (await this.assetTransfer.sendToken(
      requestOptions
    )) as ethers.providers.TransactionResponse;
    return result;
  }

  async fetchAndSetNetworks(): Promise<NetworkInfo[]> {
    let networks: NetworkInfo[] = [];
    try {
      const nets = await this.axelarService.getSupportedNetworks();
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

  async getTokenBalance(
    token: TokenConfig | undefined,
    account: string | undefined,
    config: any
  ): Promise<bigint> {
    let bal = BigInt(0);
    if (!token || !config || !account) return bal;
    try {
      const result = (await readContract(config, {
        abi: BalanceOfAbi,
        address: token.address as `0x${string}`,
        functionName: "balanceOf",
        args: [account],
      })) as bigint;
      console.log("result", result);
      bal = BigInt(result.toString());
    } catch (error) {
      console.error("Failed to get token balance:", error);
    }
    return bal;
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

  getSupportedChainTokens(chainName: string): TokenConfig[] {
    return this.axelarService.getTokensForChain(chainName);
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
