import {
  AxelarAssetTransfer,
  AxelarQueryAPI,
  Environment,
} from "@axelar-network/axelarjs-sdk";
import {
  FeeInfoResponse,
  TransferFeeResponse,
} from "@axelar-network/axelarjs-types/axelar/nexus/v1beta1/query";
import { ethers } from "ethers";
// @ts-ignore
import IAxelarGateway from "@axelar-network/axelar-gmp-sdk-solidity/artifacts/contracts/interfaces/IAxelarGateway.sol/IAxelarGateway.json";
import { writeContract } from "@wagmi/core";
import { Config } from "wagmi";
import { SupportedNetworks, TokenConfig, ChainConfig } from "./ApiService";
import { Address } from "viem";



export interface ChainTokenConfig {
  name: string;
  prettySymbol: string;
  tokenAddress: string;
  symbol: string;
}


interface AxelarTokenConfig extends TokenConfig {
  iconUrl: string;
  chains: { [key: string]: ChainTokenConfig };
}
interface AxelarConfigs {
  chains: {
    [key: string]: ChainConfig;
  };
  resources: {
    staticAssetHost: string;
  };
  assets: {
    [key: string]: AxelarTokenConfig;
  };
}

export class AxelarService {
  private configs: AxelarConfigs | null = null;
  private configUrl =
    "https://axelar-mainnet.s3.us-east-2.amazonaws.com/configs/mainnet-config-1.x.json";

  //  private configUrl = "https://axelar-testnet.s3.us-east-2.amazonaws.com/configs/testnet-config-1.x.json";
  private assetUrl = "";

  private querySdk = new AxelarQueryAPI({
    environment: Environment.MAINNET,
  });

  private assetTransfer = new AxelarAssetTransfer({
    environment: Environment.MAINNET,
  });

  constructor() {
    console.log("AxelarService constructor");
    this.init();
  }

  public isInitialized(): boolean {
    return this.configs !== null;
  }

  async init() {
    try {
      const response = await fetch(this.configUrl);
      const configs: AxelarConfigs = await response.json();
      this.configs = configs;
      this.assetUrl = configs.resources.staticAssetHost;

      console.log("init configs success");
    } catch (error) {
      console.error("Failed to initialize AxelarService:", error);
    }
  }

  public async getSupportedNetworks(): Promise<SupportedNetworks> {
    if (!this.configs) {
      throw new Error("AxelarService is not initialized yet.");
    }

    const networks = this.configs.chains;
    const result: SupportedNetworks = {};

    Object.entries(networks).forEach(([key, value]) => {
      if (value.chainType === "evm") {
        const explorer = value?.blockExplorers?.[0];
        result[key] = {
          name: value.displayName,
          icon: `${this.assetUrl}${value.iconUrl}`,
          id: parseInt(value?.externalChainId),
          assets: value.assets,
          approxFinalityWaitTime: value.config.approxFinalityWaitTime,
          gatewayAddress: value.config.contracts.AxelarGateway?.address as Address,
          blockExplorer: { // grab the first block explorer
            name: explorer?.name,
            url: explorer?.url,
          },
        };
      }
    });

    return result;
  }

  public async getFeeForChainAndAsset(
    chain: string,
    asset: TokenConfig
  ): Promise<FeeInfoResponse> {
    // get denom for token from chain
    const denom = await this.getTokenDenom(chain, asset);
    if (!denom) {
      throw new Error(`Token denom not found for token ${asset.name}`);
    }

    return await this.querySdk.getFeeForChainAndAsset(chain, denom);
  }

  public async getTransferFee(
    fromChain: string,
    toChain: string,
    token: TokenConfig,
    amount: string
  ): Promise<TransferFeeResponse> {
    // convert string to keyof CHAINS.MAINNET
    // get denom for token from chain
    // convert amount to denom units
    const denom = await this.getTokenDenom(fromChain, token);
    if (!denom) {
      throw new Error(`Token denom not found for token ${token.name}`);
    }

    return await this.querySdk.getTransferFee(
      fromChain,
      toChain,
      denom,
      Number(amount)
    );
  }

  public async getEstimatedGasFee(
    fromChain: string,
    toChain: string,
    gasLimit: string
  ) {
    const gasFee = await this.querySdk.estimateGasFee(
      fromChain,
      toChain,
      gasLimit
    );

    return gasFee;
  }

  public async transfer(
    fromChainGatewayAddress: string,
    fromChain: string,
    toChain: string,
    token: TokenConfig,
    amount: string,
    destinationAddress: string,
    config: Config
  ): Promise<string> {
    console.log("IAxelarGateway", IAxelarGateway.abi);
    const amountInAtomicUnits = ethers.utils
      .parseUnits(amount.toString(), token.decimals)
      .toString();

    const denom = (await this.getTokenDenom(fromChain, token)) || token.id;

    console.log("from chain", fromChain, fromChainGatewayAddress);
    const result = await writeContract(config, {
      address: fromChainGatewayAddress,
      abi: IAxelarGateway.abi,
      functionName: "sendToken",
      args: [toChain, destinationAddress, denom, amountInAtomicUnits],
    });
    /*
    const requestOptions: SendTokenParams = {
      fromChain,
      toChain,
      destinationAddress,
      asset: { denom, symbol: token.symbol },
      amountInAtomicUnits,
      options: {
        evmOptions: {
          signer,
          provider: provider,
          approveSendForMe: true,
        },
      },
    };
    
    return this.assetTransfer.sendToken(requestOptions) as Promise<ethers.providers.TransactionResponse>;
    */
    return result;
  }

  public getTokensForChain(chainName: string): TokenConfig[] {
    if (!this.configs) {
      throw new Error("AxelarService is not initialized yet.");
    }
    const chainId = chainName.toLowerCase();
    const chainConfig = this.configs.chains[chainId];
    if (!chainConfig) {
      throw new Error(`Chain ${chainId} not supported`);
    }

    const tokens: TokenConfig[] = [];
    Object.entries(chainConfig.assets).map(([key, address]) => {
      // TODO: only show supported tokens
      //    if (!SupportedTokens.includes(key)) {
      //     return null;
      //   }
      const tokenInfo = this.getTokenInfoForChain(key, address, chainName);
      if (!tokenInfo) return null;
      tokens.push(tokenInfo);
    });

    return tokens;
  }

  private getTokenInfoForChain(
    key: string,
    address: string,
    chainName: string
  ): TokenConfig | null {
    // Implement the logic to parse the key and return the token information.
    // This might require additional mapping if the key does not directly correspond to the token information.
    // For example:
    const token: AxelarTokenConfig | undefined = this.configs?.assets?.[key];
    if (!token) return null;

    // get token info based on chain
    const chainTokenConfig = token.chains[chainName.toLowerCase()];
    return {
      ...chainTokenConfig,
      id: token.id,
      decimals: token.decimals,
      address: address,
      icon: `${this.assetUrl}${token.iconUrl}`,
    };
  }

  public async getTokenDenom(
    chainName: string,
    token: TokenConfig
  ): Promise<string | null> {
    if (!this.configs) {
      throw new Error("AxelarService is not initialized yet.");
    }
    return await this.querySdk.getDenomFromSymbol(
      token?.symbol,
      chainName.toLowerCase()
    );
  }
}
