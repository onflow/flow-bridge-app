// src/contexts/InitializationContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import ApiService from "./services/ApiService";
import { NetworkInfo, TokenConfig } from "./services/AxelarService";
import { useAccount, useSwitchChain, useClient as useConfig } from "wagmi";
import { formatUnits } from "viem";

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
  setApproval: () => Promise<void>;
  sendTokens: () => Promise<void>;
  isApproved: boolean;
  isApproving: boolean;
  isSending: boolean;
  canSend: boolean;
  isCheckingApproval: boolean;
  displayUserBalance: () => string;
  swapNetworks: () => void;
}

const InitializationContext = createContext<
  InitializationContextType | undefined
>(undefined);

export const InitializationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { switchChain } = useSwitchChain();
  const config = useConfig();
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
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
  const [amount, setAmount] = useState<string>("0.0");
  const [amountReceive, setAmountReceive] = useState<string>("0.0");
  const [userBalance, setUserBalance] = useState<bigint>(BigInt(0));
  const [isCheckingApproval, setIsCheckingApproval] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const { isConnected, address: account, chain } = useAccount();

  useEffect(() => {
    if (!isConnected || !account || !chain?.id) {
      return;
    }
    if (address === null || address !== account) {
      setAddress(account);
      setDestinationAddress(account);
    }

    const initialize = async () => {
      try {
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

  const setApproval = async () => {
    if (!originNetwork || !destinationNetwork) {
      console.error("Source and destination networks must be selected");
      return;
    }
    setIsApproving(true);
    try {
      const tx = await ApiService.setApproval(
        originNetwork,
        destinationNetwork,
        amount
      );
      setIsApproved(true);
      console.log(tx);
    } catch (error) {
      console.error("Failed to set approval:", error);
    } finally {
      setIsApproving(false);
    }
  };

  const sendTokens = async () => {
    if (!originNetwork || !destinationNetwork || !destinationAddress) {
      console.error(
        "Source and destination networks must be selected, destination address must be provided"
      );
      return;
    }

    if (!sourceToken) {
      console.error(
        "Transfer token should be selected",
      )
      return;
    }
    setIsSending(true);
    try {
      const tx = await ApiService.sendTokens(
        originNetwork,
        destinationNetwork,
        destinationAddress,
        sourceToken,
        amount,
      );
      console.log(tx);
    } catch (error) {
      console.error("Failed to send tokens:", error);
    } finally {
      setIsSending(false);
    }
  };

  // set amount and test for approval status on source network only
  useEffect(() => {
    if (!originNetwork || !amount || amount === "0.0") {
      return;
    }

    const checkApproval = async () => {
      setIsCheckingApproval(true);
      try {
        const approved = await ApiService.checkApproval(originNetwork, amount);
        setIsApproved(approved);
      } catch (error) {
        console.error("Failed to check approval:", error);
      } finally {
        setIsCheckingApproval(false);
      }
    };

    checkApproval();
  }, [originNetwork, amount]);

  const setSourceNetwork = (network: NetworkInfo) => {
    // set tokens for network
    const tokens = ApiService.getSupportedChainTokens(String(network.name));
    setSourceNetworkTokens(tokens);
    setOriginNetwork(network);
    // Could configure to have a specific default token per network
    const defaultToken = ApiService.DefaultToken;
    const defToken = tokens.find((token) => token.id === defaultToken);
    const t = defToken || tokens[0] || sourceToken;
    setToken(t);
    switchChain({ chainId: Number(network.id) });
  };

  const setToken = async (token: TokenConfig) => {
    setSourceToken(token);
    const balance = await ApiService.getTokenBalance(
      token,
      account,
      config
    );
    setUserBalance(balance);
  };

  const swapNetworks = () => {
    if (!originNetwork || !destinationNetwork) {
      console.error("Source and destination networks must be selected");
      return;
    }
    const source = originNetwork; 
    setSourceNetwork(destinationNetwork);
    setDestinationNetwork(source);
  }

  const displayUserBalance = () => {
    return formatUnits(userBalance, Number(sourceToken?.decimals) || 18);
  };

  const canSend = true;
/*    isApproved &&
    !isApproving &&
    !isSending &&
    amount !== "0.0" &&
    destinationAddress !== undefined;
*/
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
        setApproval,
        sendTokens,
        isApproved,
        isApproving,
        isSending,
        canSend,
        isCheckingApproval,
        displayUserBalance,
        swapNetworks,
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
