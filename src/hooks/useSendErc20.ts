import { Address, parseUnits, erc20Abi } from "viem";
import {
  useBlockNumber,
  useWriteContract,
} from "wagmi";
import { TokenConfig } from "../services/ApiService";

export function useSendErc20(
  chainId: number | undefined,
) {
  const { data: blockNumber } = useBlockNumber({
    chainId: chainId as number,
  });

  const { writeContract, isSuccess, data, error } = useWriteContract();

  const sendTransfer = (
    token: TokenConfig,
    amount: string,
    destinationAddress: string,
  ) => {
    writeContract({
      address: token.address as Address,
      abi: erc20Abi,
      functionName: "transfer",
      args: [
        destinationAddress as Address,
        parseUnits(amount ? amount : "0", token?.decimals ?? 0),
      ],
    });
  };

  return {
    sendTransfer,
    sendErc20: data,
    error: error,
    isSuccess: isSuccess,
  };
}
