// src/contexts/InitializationContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import ApiService, {
  BridgingRate,
  NetworkInfo,
  TokenConfig,
} from "./services/ApiService";
import {
  useAccount,
  useSwitchChain,
  useClient,
  useConfig,
  Config,
} from "wagmi";
import { useBridgeTokens } from "./hooks/useBridgeTokens";
import { useTokenApproval } from "./hooks/useTokenApproval";
import type { Address } from "viem";
import { formatUnits, parseUnits } from "viem";

interface TransferFee {
  fee: string;
  denom: string;
}
interface InitializationContextType {
  initialized: boolean;
  networks: NetworkInfo[];
  loading: boolean;
  address: string | undefined;
  error: string | undefined;
  destinationAddress: string | undefined;
  setDestinationNetwork: React.Dispatch<
    React.SetStateAction<NetworkInfo | undefined>
  >;
  setDestinationAddress: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setSourceNetwork: (network: NetworkInfo) => void;
  setToken: (token: TokenConfig) => void;
  sourceToken: TokenConfig | undefined;
  destinationNetwork: NetworkInfo | undefined;
  sourceNetwork: NetworkInfo | undefined;
  sourceNetworkTokens: TokenConfig[];
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  amountReceive: string;
  setAmountReceive: React.Dispatch<React.SetStateAction<string>>;
  isApproved: (amount: string) => boolean;
  isApproving: boolean;
  displayUserBalance: () => string;
  swapNetworks: () => void;
  bridgingFee: BridgingRate | undefined;
  canSend: boolean;
  transferFee: TransferFee | undefined;
  approveTokenAmount: (amount: string) => void;
  approvalTxHash: `0x${string}` | undefined;
  transferTxHash: `0x${string}` | undefined;
  config: Config;
  approvalStatus: string | undefined;
  transferStatus: string | undefined;
}

const InitializationContext = createContext<
  InitializationContextType | undefined
>(undefined);

export const InitializationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { switchChain } = useSwitchChain();
  const client = useClient();
  const config = useConfig();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [networks, setNetworks] = useState<NetworkInfo[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [address, setAddress] = useState<string | undefined>();
  const [originNetwork, setOriginNetwork] = useState<NetworkInfo>();
  const [sourceNetworkTokens, setSourceNetworkTokens] = useState<TokenConfig[]>(
    []
  );
  const [sourceToken, setSourceToken] = useState<TokenConfig>();
  const [destinationNetwork, setDestinationNetwork] = useState<NetworkInfo>();
  const [destinationAddress, setDestinationAddress] = useState<string>();
  const [amount, setAmount] = useState<string>("");
  const [amountReceive, setAmountReceive] = useState<string>("");
  const [userBalance, setUserBalance] = useState<bigint>(BigInt(0));
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [bridgingFee, setBridgingFee] = useState<BridgingRate>();
  const [transferFee, setTransferFee] = useState<TransferFee>();

  const { isConnected, address: account, chain } = useAccount();

  const { transactionHash: transferTxHash, status: transferStatus } =
    useBridgeTokens();

  const {
    isApproved,
    approveToken,
    transactionHash: approvalTxHash,
    status: approvalStatus,
  } = useTokenApproval(sourceToken, account as Address, originNetwork, config);

  //console.log("bridging", bridgeError, isError, isSuccess, transferTxHash, transferStatus);
  //console.log("approving", approvalError, approvalIsError, allowance, approvalTxHash, approvalStatus);

  useEffect(() => {
    if (!isConnected || !account || !chain?.id) {
      return;
    }
    if (address === null || address !== account) {
      setAddress(account);
      if (!account.startsWith("0x00000")) { // don't allow users to put in COA address
        setDestinationAddress(account);
      }
    }

    const initialize = async () => {
      try {
        setLoading(true);
        console.log("initializing");
        // TODO need better bootup logic than testing initialized
        while (!ApiService.isInitialized()) {
          console.log("waiting for initialization");
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        const fetchedNetworks = await ApiService.fetchAndSetNetworks();
        setNetworks(fetchedNetworks);
        setInitialized(true);

        let source: NetworkInfo = fetchedNetworks[0];
        let destination: NetworkInfo = fetchedNetworks[1];
        fetchedNetworks.forEach((network) => {
          if (network.id === chain?.id) {
            source = network;
          } else if (
            // TODO: set to flow if source is not flow
            network.name.toLocaleLowerCase().indexOf("ethereum") !== -1
          ) {
            destination = network;
          }
        });
        setSourceNetwork(source);
        if (!destinationNetwork) setDestinationNetwork(destination);
      } catch (err) {
        setError("Failed to initialize application");
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [chain?.id, isConnected, account]);

  const approveTokenAmount = async (amount: string) => {
    if (!sourceToken) {
      console.error("Transfer token should be selected");
      return;
    }
    setIsApproving(true);
    try {
      const approvalTx = await approveToken(amount);
      console.log(approvalTx);
    } catch (error) {
      console.error("Failed to approve token amount:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const setSourceNetwork = (network: NetworkInfo) => {
    setLoading(true);
    try {
      // set tokens for network
      const tokens = ApiService.getSupportedChainTokens(
        String(network.nameKey)
      );
      setSourceNetworkTokens(tokens);
      setOriginNetwork(network);
      setAmount(""); // reset amount
      // Could configure to have a specific default token per network
      const defaultToken = ApiService.DefaultToken;
      const defToken = tokens.find((token) => token.id === defaultToken);
      const t = defToken || tokens[0] || sourceToken;
      setToken(t);
      switchChain({ chainId: Number(network.id) });
    } finally {
      setLoading(false);
    }
  };

  const setToken = async (token: TokenConfig) => {
    setSourceToken(token);
    setAmount("");
    if (!account) {
      return;
    }
    const balance = await ApiService.getTokenBalance(token, account, client);
    setUserBalance(balance);
  };

  const formatToCurrency = (value: string): string => {
    const number = Number(value);
    return number.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "decimal",
    });
  };

  const swapNetworks = () => {
    if (!originNetwork || !destinationNetwork) {
      console.error("Source and destination networks must be selected");
      return;
    }
    const source = originNetwork;
    setSourceNetwork(destinationNetwork);
    setDestinationNetwork(source);
  };

  const displayUserBalance = () => {
    return formatUnits(userBalance, Number(sourceToken?.decimals) || 18);
  };

  useMemo(async () => {
    if (
      !originNetwork?.id ||
      !destinationNetwork?.id ||
      !sourceToken?.address ||
      !amount
    ) {
      return;
    }

    try {
      setLoading(true);
      const { transferFee: sendTokenFee, bridgingRate } =
        await ApiService.getBridgingFee(
          originNetwork as NetworkInfo,
          destinationNetwork as NetworkInfo,
          sourceToken as TokenConfig,
          amount
        );

      let vFee = formatUnits(
        BigInt(sendTokenFee.amount),
        Number(sourceToken?.decimals) || 18
      );
      setBridgingFee(bridgingRate);

      vFee = formatToCurrency(vFee);
      setTransferFee({
        fee: vFee,
        denom: sendTokenFee.denom || sourceToken?.prettySymbol,
      });
    } finally {
      setLoading(false);
    }
  }, [amount, sourceToken?.address, originNetwork?.id, destinationNetwork?.id]);

  const canSend =
    amount !== "0.0" &&
    Number(amount) > 0 &&
    userBalance > 0 &&
    BigInt(parseUnits(amount, Number(sourceToken?.decimals)) || 18) <=
      userBalance &&
    Number(amountReceive) > 0;

  return (
    <InitializationContext.Provider
      value={{
        initialized,
        networks,
        loading,
        error,
        address,
        sourceNetwork: originNetwork,
        destinationNetwork,
        destinationAddress,
        setDestinationNetwork,
        setDestinationAddress,
        setSourceNetwork,
        sourceNetworkTokens,
        setToken,
        sourceToken,
        amount,
        setAmount,
        amountReceive,
        setAmountReceive,
        isApproved,
        isApproving,
        displayUserBalance,
        swapNetworks,
        bridgingFee,
        canSend,
        transferFee,
        approveTokenAmount,
        approvalTxHash,
        transferTxHash,
        config,
        approvalStatus,
        transferStatus,
      }}
    >
      {children}
    </InitializationContext.Provider>
  );
};

export const useInitialization = () => {
  const context = useContext(InitializationContext);
  if (context === undefined) {
    throw new Error(
      "useInitialization must be used within an InitializationProvider"
    );
  }
  return context;
};
