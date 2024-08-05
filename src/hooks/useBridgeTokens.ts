import { Address, parseUnits } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { TokenConfig, NetworkInfo } from "../services/ApiService";
// @ts-ignore
import IAxelarGateway from "@axelar-network/axelar-gmp-sdk-solidity/artifacts/contracts/interfaces/IAxelarGateway.sol/IAxelarGateway.json";

export const useBridgeTokens = () => {
  const { writeContract, isSuccess, data, error, isError, status } = useWriteContract();
  const { data: receipt } = useWaitForTransactionReceipt({ hash: data });

  // add estimate transaction method

  const bridgeTokens = async (
    fromNetwork: NetworkInfo,
    toChain: string,
    token: TokenConfig,
    amount: string,
    destinationAddress: string,
    denom: string
  ) => {
    if (
      !fromNetwork ||
      !toChain ||
      !token ||
      !amount ||
      !destinationAddress ||
      !denom ||
      amount === "0"
    ) {
      return;
    }

    //    console.log("IAxelarGateway", IAxelarGateway.abi);
    const amountInAtomicUnits = parseUnits(
      amount.toString(),
      token.decimals
    ).toString();

    //   console.log("from chain", fromNetwork.name, fromNetwork.gatewayAddress, denom, amountInAtomicUnits);
    writeContract({
      address: fromNetwork.gatewayAddress as Address,
      abi: IAxelarGateway.abi,
      functionName: "sendToken",
      args: [toChain, destinationAddress, denom, amountInAtomicUnits],
    });
  };

  return {
    bridgeTokens,
    transactionHash: data,
    receipt,
    error: error,
    isError: isError,
    isSuccess: isSuccess,
    status,
  };
};
