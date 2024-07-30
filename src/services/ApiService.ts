import { Address, Client, parseUnits } from "viem";

import { AxelarService } from "./AxelarService";
import { readContract } from "viem/actions";
import { Config } from "wagmi";

export interface ChainConfig {
  displayName: string;
  iconUrl: string;
  chainType: string;
  externalChainId: string;
  assets: { [key: string]: string };
  config: {
    approxFinalityWaitTime: number;
    contracts: {
      AxelarGateway: { address: string };
      Multisig: { address: string };
    };
  };
  blockExplorers: { name: string; url: string }[];
}
export interface TokenConfig {
  id: string;
  prettySymbol: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
  address: string;
}
export interface NetworkInfo {
  name: string;
  icon: string;
  id: number;
  approxFinalityWaitTime: number;
  assets: { [key: string]: string };
  gatewayAddress: Address;
  blockExplorer: { name: string; url: string };
}

export interface SupportedNetworks {
  [key: string]: NetworkInfo;
}

export interface BridgingRate {
  chain: string;
  token: TokenConfig;
  feeRate: bigint;
  minFee: bigint;
  maxFee: bigint;
}

export interface BridgingTransferFee {
  transferFee: {
    amount: string;
    denom: string | undefined;
  };
  bridgingRate: BridgingRate;
}

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
    destinationChain: NetworkInfo,
    destinationAddress: string,
    token: TokenConfig,
    amount: string,
    config: Config
  ): Promise<string> {
    const amountInAtomicUnits = parseUnits(
      amount.toString(),
      token.decimals
    ).toString();

    const tx = this.axelarService.transfer(
      sourceChain.gatewayAddress,
      sourceChain.name,
      destinationChain.name,
      token,
      amountInAtomicUnits,
      destinationAddress,
      config
    );
    return tx;
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

  async getTokenBalance(
    token: TokenConfig | undefined,
    account: string | undefined,
    config: Client | undefined
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
      console.log("user balance:", result);
      bal = BigInt(result.toString());
    } catch (error) {
      console.error("Failed to get token balance:", error);
    }
    return bal;
  }

  async getBridgingFee(
    sourceNetwork: NetworkInfo,
    destinationNetwork: NetworkInfo,
    token: TokenConfig,
    amount: string
  ): Promise<BridgingTransferFee> {
    const transferFee = await this.axelarService.getTransferFee(
      sourceNetwork.name,
      destinationNetwork.name,
      token,
      amount
    );

    const chainFees = await this.axelarService.getFeeForChainAndAsset(
      sourceNetwork.name,
      token
    );

    console.log("chainFees", chainFees);
    console.log("transferFee", transferFee);

    if (transferFee.fee?.denom === token.id) {
      transferFee.fee.denom = token.prettySymbol;
    }
    // get tokenConfig for source chain
    const fees = {
      transferFee: {
        amount: transferFee?.fee?.amount || "0",
        denom: transferFee?.fee?.denom,
      },
      bridgingRate: {
        chain: sourceNetwork.name,
        token,
        feeRate: this.uint8ArrayToBigInt(chainFees.feeInfo?.feeRate),
        minFee: this.uint8ArrayToBigInt(chainFees.feeInfo?.minFee),
        maxFee: this.uint8ArrayToBigInt(chainFees.feeInfo?.maxFee),
      },
    };
    return fees;
  }

  getEstimatedTimeOfArrival(): string {
    return "10 minutes";
  }

  getSupportedChainTokens(chainName: string): TokenConfig[] {
    return this.axelarService.getTokensForChain(chainName);
  }

  uint8ArrayToBigInt(uint8Array: Uint8Array | undefined): bigint {
    let result = BigInt(0);
    if (!uint8Array) return result;
    for (let byte of uint8Array) {
      result = (result << BigInt(8)) + BigInt(byte);
    }
    return result;
  }
}

export default new ApiService();
