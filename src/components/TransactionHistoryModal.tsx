// src/components/NetworkSelectorModal.tsx
import React, { useEffect } from "react";
import GenericModal from "./GenericModal";
import { useInitialization } from "../InitializationContext";
import Spinner from "./Spinner";
import { useBlockNumber } from "wagmi";
import axios from "axios";
import { NetworkInfo } from "../services/ApiService";
import { TransactionEntry } from "./TransactionEntry";

interface TransactionConfirmationModalProps {
  onClose: () => void;
}

const blockExplorerApis: { [key: string]: string } = {
  base: "https://api.basescan.org/api",
  polygon: "https://api.polygonscan.com/api",
  bsc: "https://api.bscscan.com/api",
  fantom: "https://api.ftmscan.com/api",
  arbitrum: "https://api.arbiscan.io/api",
  optimism: "https://api.optimism.io/api",
  xdai: "https://blockscout.com/poa/xdai/api",
  ethereum: "https://api.etherscan.io/api",
};

const TransactionConfirmationModal: React.FC<
  TransactionConfirmationModalProps
> = ({ onClose }) => {
  const {
    address,
    sourceNetwork,
    sourceNetworkTokens,
    networks,
  } = useInitialization();

  const blockNumber = useBlockNumber();
  const [noExplorer, setNoExplorer] = React.useState(false);
  const [userBridgedTxs, setUserBridgedTxs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const getBlockExplorerApi = (network: NetworkInfo): string => {
    const name = network.name.toLowerCase();
    return blockExplorerApis[name];
  };

  useEffect(() => {
    const getHistory = async (address: string) => {
      if (!sourceNetwork || !address || !blockNumber?.data) return;
      const api = getBlockExplorerApi(sourceNetwork);
      if (!api) {
        console.error("No block explorer API found for network");
        setNoExplorer(true);
        return;
      }
      setLoading(true);
      try {
        // get user's transaction history
        const apiUrl = `${api}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc`;
        console.log(apiUrl);
        const response = await axios.get(
          `/api/proxy?url=${encodeURIComponent(apiUrl)}`
        );
        const history = await response.data.result;
        console.log(history);

        // filter to only the gateway contract transactions
        const bridgeTxs = (history || []).filter(
          (tx: any) =>
            tx.to.toLowerCase() === sourceNetwork?.gatewayAddress.toLowerCase()
        );
        console.log(bridgeTxs);
        setUserBridgedTxs(bridgeTxs);
      } finally {
        setLoading(false);
      }
    };
    if (address) getHistory(address);
  }, [sourceNetwork, address, blockNumber?.data]);

  return (
    <GenericModal title="Your latest transactions" onClose={onClose}>
      <div className="flex flex-col h-full text-center">
        {userBridgedTxs.length > 0 &&
          userBridgedTxs.map((tx: any, index: number) => (
            <TransactionEntry
              key={index}
              tx={tx}
              sourceNetwork={sourceNetwork}
              tokens={sourceNetworkTokens}
              networks={networks}
            />
          ))}
        {loading && <Spinner />}
        {userBridgedTxs.length === 0 && !loading && !noExplorer && (
          <div className="flex justify-center mb-6 items-center m-20">
            No Transactions Found
          </div>
        )}
        {noExplorer && (
          <div className="flex justify-center mb-6 items-center m-20">
            No block explorer available for this network
          </div>
        )}
      </div>
    </GenericModal>
  );
};

export default TransactionConfirmationModal;
