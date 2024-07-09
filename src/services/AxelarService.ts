interface ChainConfig {
  displayName: string;
  iconUrl: string;
  chainType: string;
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
}

interface SupportedNetworks {
  [key: string]: NetworkInfo;
}

export class AxelarService {
  private configs: AxelarConfigs | null = null;
  private configUrl =
    "https://axelar-mainnet.s3.us-east-2.amazonaws.com/configs/mainnet-config-1.x.json";
  private assetUrl = "";
  private networks: NetworkInfo[] = [];

  constructor() {}

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
        };
      }
    });

    return result;
  }
}
