import { NetworkInfo, TokenConfig } from "../services/ApiService";
import { ethers } from "ethers";
import IAxelarGateway from "@axelar-network/axelar-gmp-sdk-solidity/artifacts/contracts/interfaces/IAxelarGateway.sol/IAxelarGateway.json";
import { formatUnits } from "viem";
import { RightArrowIcon } from "./RightArrowIcon";
import { ExternalLinkLargeIcon } from "./ExternalLinkLargeIcon";

interface TransactionDetails {
  input: string;
  blockHash: string;
  blockNumber: string;
  from: string;
  functionName: string;
  timeStamp: string;
  to: string;
  hash: string;
  method: string;
  txreceipt_status: string;
  value: string;
}

interface Details {
  destinationNetwork: string;
  userAddress: string;
  tokenSymbol: string;
  amount: string;
}

export const TransactionEntry = ({
  tx,
  sourceNetwork,
  tokens,
  networks,
}: {
  tx: TransactionDetails;
  sourceNetwork: NetworkInfo | undefined;
  tokens: TokenConfig[];
  networks: NetworkInfo[];
}) => {
  const { input, txreceipt_status, timeStamp } = tx;

  function formatTimestamp(unixTimestamp: string): string {
    const timestamp = parseInt(unixTimestamp, 10);
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }

  const parseBridgeTxInputs = (inputData: string): Details => {
    const iface = new ethers.utils.Interface(IAxelarGateway.abi);
    const decoded = iface.parseTransaction({ data: inputData });
    console.log(decoded);
    console.log(tokens);
    const token = tokens.find((token) => token.symbol === decoded.args[2]);
    const decimals = token?.decimals || 18;

    return {
      destinationNetwork: decoded.args[0],
      userAddress: decoded.args[1],
      tokenSymbol: decoded.args[2],
      amount: formatUnits(decoded.args[3], decimals).toString(),
    };
  };

  const parseTxStatus = (status: string) => {
    // use switch statement to return "Success" if status is "1" and "Failed" if status is "0"
    switch (status) {
      case "1":
        return "Success";
      case "0":
        return "Failed";
      default:
        return "Pending";
    }
  };

  const getNetworkItem = (name: string) => {
    const network = networks.find((network) => network.name === name);
    return (
      <div className="flex flex-row items-center">
        <img
          src={network?.icon}
          alt={`${name} icon`}
          className="w-6 h-6 mr-2"
        />
        <div className="flex flex-col items-start text-nowrap">
          <span className="">{network?.name}</span>
        </div>
      </div>
    );
  };

  const details = parseBridgeTxInputs(input);
  const datetime = formatTimestamp(timeStamp);
  const status = parseTxStatus(txreceipt_status);

  return (
    <div className="flex flex-col items-start justify-between bg-gray-800 px-4 py-2 rounded-lg">
      <div className="flex items-center justify-between w-full">
        <span className="flex">
          {getNetworkItem(
            sourceNetwork?.name as string,
          )}
          <RightArrowIcon />
          {getNetworkItem(
            details?.destinationNetwork,
          )}
        </span>
        <span className="text-sm text-gray-400">{status}</span>
      </div>
      <div className="flex items-center justify-between w-full">
        <span className="flex text-xs text-gray-400 items-center">
          {details?.amount} {details?.tokenSymbol}
          <a
            href={`${sourceNetwork?.blockExplorer?.url}/tx/${tx.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLinkLargeIcon />
          </a>
        </span>
        <span className="text-nowrap text-sm text-gray-400">{datetime}</span>
      </div>
    </div>
  );
};
