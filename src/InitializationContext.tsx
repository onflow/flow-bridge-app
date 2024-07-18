// src/contexts/InitializationContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import ApiService, { Asset } from "./services/ApiService";
import { NetworkInfo } from "./services/AxelarService";
import { useAccount } from "wagmi";

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
  setSourceNetwork: React.Dispatch<
    React.SetStateAction<NetworkInfo | undefined>
  >;
  setAsset: React.Dispatch<React.SetStateAction<Asset | undefined>>;
  destinationNetwork: NetworkInfo | undefined;
  sourceNetwork: NetworkInfo | undefined;
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
}

const InitializationContext = createContext<
  InitializationContextType | undefined
>(undefined);

export const InitializationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [networks, setNetworks] = useState<NetworkInfo[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [address, setAddress] = useState<string | undefined>();
  const [sourceNetwork, setSourceNetwork] = useState<NetworkInfo>();
  const [destinationNetwork, setDestinationNetwork] = useState<NetworkInfo>();
  const [destinationAddress, setDestinationAddress] = useState<string>();
  const [amount, setAmount] = useState<string>("0.0");
  const [amountReceive, setAmountReceive] = useState<string>("0.0");
  const [isCheckingApproval, setIsCheckingApproval] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(true);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [asset, setAsset] = useState<Asset>();

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
        setDestinationNetwork(destination);
      } catch (err) {
        setError("Failed to initialize application");
      } finally {
        setLoading(false);
      }
    };

    console.log("initializing");
    initialize();
  }, [chain?.id, isConnected, account]);

  const setApproval = async () => {
    if (!sourceNetwork || !destinationNetwork) {
      console.error("Source and destination networks must be selected");
      return;
    }
    setIsApproving(true);
    try {
      const tx = await ApiService.setApproval(
        sourceNetwork,
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
    if (!sourceNetwork || !destinationNetwork || !destinationAddress) {
      console.error(
        "Source and destination networks must be selected, destination address must be provided"
      );
      return;
    }

    if (!asset) {
      console.error(
        "Asset should be selected",
      )
      return;
    }
    setIsSending(true);
    try {
      const tx = await ApiService.sendTokens(
        sourceNetwork,
        destinationNetwork,
        destinationAddress,
        asset,
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
    if (!sourceNetwork || !amount || amount === "0.0") {
      return;
    }

    const checkApproval = async () => {
      setIsCheckingApproval(true);
      try {
        const approved = await ApiService.checkApproval(sourceNetwork, amount);
        setIsApproved(approved);
      } catch (error) {
        console.error("Failed to check approval:", error);
      } finally {
        setIsCheckingApproval(false);
      }
    };

    checkApproval();
  }, [sourceNetwork, amount]);

  const canSend = isApproved && !isApproving && !isSending && amount !== "0.0" && destinationAddress !== undefined;

  console.log(
    "isConnected",
    isConnected,
    isApproved,
    amount,
    isApproving,
    isSending,
    "canSend:",
    canSend,
  );
  return (
    <InitializationContext.Provider
      value={{
        initialized,
        networks,
        loading,
        error,
        address,
        sourceNetwork,
        destinationNetwork,
        destinationAddress,
        setDestinationNetwork,
        setDestinationAddress,
        setSourceNetwork,
        amount,
        setAmount,
        amountReceive,
        setApproval,
        setAsset,
        sendTokens,
        isApproved,
        isApproving,
        isSending,
        canSend,
        isCheckingApproval,
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
