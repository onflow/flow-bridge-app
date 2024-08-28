import { AxelarQueryAPI, Environment } from "@axelar-network/axelarjs-sdk";
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

// TODO: Support PYUSD when it gets added to the Axelar configs
/* Need to add translation for token symbols to denoms 
pyUSD rename to USDf
axlBTC rename to BTCf
axlETH rename to ETHf
*/
const SupportedTokens = ["uausdc", "uaxl", "wbtc-satoshi", "weth-wei"];
const SupportedTokensNames: { [key: string]: string } = {
  uausdc: "USDf",
  uaxl: "AXL",
  "wbtc-satoshi": "BTCf",
  "weth-wei": "ETHf",
};

export class AxelarService {
  private configs: AxelarConfigs | null = null;
  private configUrl = "https://axelar-mainnet.s3.us-east-2.amazonaws.com/configs/mainnet-config-1.x.json";

  // private configUrl =
  //  "https://axelar-testnet.s3.us-east-2.amazonaws.com/configs/testnet-config-1.x.json";
  private assetUrl = "";

  private querySdk = new AxelarQueryAPI({
    environment: Environment.MAINNET,
  });

  constructor() {
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
          nameKey: value?.id,
          icon: `${this.assetUrl}${value.iconUrl}`,
          id: parseInt(value?.externalChainId),
          assets: value.assets,
          approxFinalityWaitTime: value.config.approxFinalityWaitTime,
          gatewayAddress: value.config?.contracts?.AxelarGateway
            ?.address as Address,
          blockExplorer: {
            // grab the first block explorer
            name: explorer?.name,
            url: explorer?.url,
          },
          nativeCurrency: {
            name: value.nativeCurrency?.name,
            symbol: value.nativeCurrency?.symbol,
            decimals: value.nativeCurrency?.decimals,
            iconUrl: `${this.assetUrl}${value.nativeCurrency?.iconUrl}`,
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
    let denom = await this.getTokenDenom(chain, asset);

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
    gasLimit: string,
    token: string
  ): Promise<string> {
    const gasFee = await this.querySdk
      .estimateGasFee(fromChain, toChain, gasLimit, "auto", token)
      .catch((error) => {
        console.error("Failed to estimate gas fee:", error);
      });

    return gasFee as string;
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
      if (!SupportedTokens.includes(key)) {
        return null;
      }
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
      translatedSymbol: SupportedTokensNames[key],
    };
  }

  public async getTokenDenom(
    chainName: string,
    token: TokenConfig
  ): Promise<string> {
    if (!this.configs) {
      throw new Error("AxelarService is not initialized yet.");
    }
    let denom = await this.querySdk.getDenomFromSymbol(
      token?.symbol,
      chainName.toLowerCase()
    );
    if (!denom) {
     denom = token.symbol;
    } 
    return denom as string;
  }
}
