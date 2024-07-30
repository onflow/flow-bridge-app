import { Address, parseUnits, erc20Abi } from "viem";
import {
  useBlockNumber,
  useWriteContract,
  useAccount,
  useSimulateContract,
  useReadContract,
} from "wagmi";
import { NetworkInfo, TokenConfig } from "../services/ApiService";
import { useEffect, useState } from "react";

export const useTokenApproval = (
  token: TokenConfig | undefined,
  owner: Address,
  fromChain: NetworkInfo
) => {
  const { writeContract, isSuccess, data, error, isError } = useWriteContract();

  const { data: allowance } = useReadContract({
    address: token?.address as Address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, fromChain?.gatewayAddress],
  });

  const approveToken = (
    amount: string
  ) => {
    const value = parseUnits(amount ? amount : "0", token?.decimals ?? 0);
    const spender = fromChain.gatewayAddress as Address;
    if (!token || !spender) {
        console.error("Token or spender not found");
        return;
    }
    writeContract({
      address: token.address as Address,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, value],
    });
  };

  return {
    approveToken,
    allowance,
    data,
    error,
    isSuccess,
    isError,
  };
};
