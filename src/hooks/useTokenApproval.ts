import { Address, parseUnits, erc20Abi } from "viem";
import {
  useWriteContract,
  useTransactionConfirmations,
  useWaitForTransactionReceipt,
  Config,
} from "wagmi";
import { NetworkInfo, TokenConfig } from "../services/ApiService";
import { useEffect, useState } from "react";
import { readContract } from "@wagmi/core";

export const useTokenApproval = (
  token: TokenConfig | undefined,
  owner: Address,
  fromChain: NetworkInfo | undefined,
  config: Config
) => {
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [allowance, setAllowance] = useState<bigint>(BigInt(0));
  const { writeContract, isSuccess, status, data, error, isError } =
    useWriteContract();
  const { data: confirmations } = useTransactionConfirmations({ hash: data });
  const { data: receipt } = useWaitForTransactionReceipt({ hash: data });

  useEffect(() => {
    if (!token || !fromChain || !owner) {
      return;
    }
    const getAllowance = async () => {
      const allow = await readContract(config, {
        address: token?.address as Address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [owner, fromChain?.gatewayAddress],
      });
      setAllowance(allow);
    };
    getAllowance();
  }, [token, owner, fromChain, config, confirmations]);

  const approveToken = (amount: string) => {
    setConfirmed(false);
    const value = parseUnits(amount ? amount : "0", token?.decimals ?? 0);
    const spender = fromChain?.gatewayAddress as Address;
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

  const isApproved = (amount: string) => {
    const value = parseUnits(amount ? amount : "0", token?.decimals ?? 0);
    return allowance >= BigInt(value);
  };

  console.log("useTokenApproval",
    allowance,
    receipt,
    data,
    status
  );

  return {
    isApproved,
    approveToken,
    allowance,
    receipt,
    transactionHash: data,
    error,
    isSuccess,
    isError,
    status,
  };
};
