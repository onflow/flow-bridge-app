// src/contexts/InitializationContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import ApiService from "./services/ApiService";
import { NetworkInfo } from "./services/AxelarService";

interface InitializationContextType {
  initialized: boolean;
  networks: NetworkInfo[];
  loading: boolean;
  error: string | null;
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const fetchedNetworks = await ApiService.fetchAndSetNetworks();
        setNetworks(fetchedNetworks);
        setInitialized(true);

        let source: NetworkInfo = fetchedNetworks[0];
        let destination: NetworkInfo = fetchedNetworks[1];
        fetchedNetworks.forEach((network) => {
          if (network.name.toLocaleLowerCase() === "base") {
            source = network;
          } else if (
            network.name.toLocaleLowerCase().indexOf("ethereum") !== -1
          ) {
            destination = network;
          }
        });
        // Initialize the store with default values
        ApiService.updateStoreForBridge(source, destination, "100");
      } catch (err) {
        setError("Failed to initialize application");
      } finally {
        setLoading(false);
      }
    };

    console.log("initializing");
    initialize();
  }, []);

  return (
    <InitializationContext.Provider
      value={{ initialized, networks, loading, error }}
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
