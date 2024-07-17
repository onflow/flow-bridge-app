import { parse } from "path";
import { AxelarAssetTransfer, AxelarQueryAPI, Environment, CHAINS, SendTokenParams } from "@axelar-network/axelarjs-sdk";
import { ethers, Signer } from "ethers";

interface ChainConfig {
  displayName: string;
  iconUrl: string;
  chainType: string;
  externalChainId: string;
  assets: { [key: string]: string };
}

interface AxelarConfigs {
  chains: {
    [key: string]: ChainConfig;
  };
  resources: {
    staticAssetHost: string;
  };
}

export interface NetworkInfo {
  name: string;
  icon: string;
  id: number;
  assets: { [key: string]: string };
}

interface SupportedNetworks {
  [key: string]: NetworkInfo;
}

type Asset = {
  denom: string,
  decimals: number,
}

type CommonArgs = {
  fromChain: keyof typeof CHAINS.MAINNET;
  toChain: keyof typeof CHAINS.MAINNET;
  asset: Asset
}

const FLOW_RPC_ENDPOINT = "https://previewnet.evm.nodes.onflow.org";

export class AxelarService {
  private configs: AxelarConfigs | null = null;
  private configUrl =
    "https://axelar-mainnet.s3.us-east-2.amazonaws.com/configs/mainnet-config-1.x.json";
  private assetUrl = "";
  private provider = new ethers.providers.JsonRpcProvider(FLOW_RPC_ENDPOINT);
  private networks: NetworkInfo[] = [];
  private querySdk = new AxelarQueryAPI({
    environment: Environment.MAINNET,
  });
  private assetTransfer = new AxelarAssetTransfer({
    environment: Environment.MAINNET,
  })
  constructor() { }

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
        result[key] = {
          name: value.displayName,
          icon: `${this.assetUrl}${value.iconUrl}`,
          id: parseInt(value?.externalChainId),
          assets: value.assets,
        };
      }
    });

    return result;
  }
  public async getTransferFee({ fromChain, toChain, asset, amount }: CommonArgs & { amount: number }) {
    const fee = await this.querySdk.getTransferFee(fromChain, toChain, asset.denom, amount);
    return fee
  }
  public async getEstimatedGasFee({ fromChain, toChain, gasLimit }: CommonArgs & { gasLimit: number }) {
    const gasFee = await this.querySdk.estimateGasFee(fromChain, toChain, gasLimit)
    return gasFee
  }
  public async transfer({ fromChain, toChain, asset, amount, destinationAddress, signer }: CommonArgs & { destinationAddress: string, signer: Signer, amount: number }) {
    const amountInAtomicUnits = ethers.utils
      .parseUnits(amount.toString(), asset.decimals).toString();
    const requestOptions: SendTokenParams = {
      fromChain,
      toChain,
      destinationAddress,
      asset: { denom: asset.denom },
      amountInAtomicUnits,
      options: {
        evmOptions: {
          signer,
          provider: this.provider,
          approveSendForMe: true,
        }
      }
    }
    return this.assetTransfer.sendToken(requestOptions)
  }
}
