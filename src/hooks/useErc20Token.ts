import { Address, parseUnits, erc20Abi, formatUnits } from "viem";
import { useReadContract, useAccount } from "wagmi";
import { TokenConfig } from "../services/ApiService";

export const useErc20Token = (token: TokenConfig) => {
  const { address } = useAccount();

  const result = useReadContract({
    address: token.address as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address as Address],
  });

  console.log("token balance", token?.name, result?.data?.toString());
  // convert result to readable balance
  const balance = formatUnits(result?.data || BigInt(0), token.decimals);

  return {
    balance: balance.toString(),
  };
};
