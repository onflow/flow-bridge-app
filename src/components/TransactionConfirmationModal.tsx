// src/components/NetworkSelectorModal.tsx
import React, { useState, useEffect } from "react";
import GenericModal from "./GenericModal";
import { useInitialization } from "../InitializationContext";
import NetworkBalance from "./NetworkBalance";
import RateInfoPanel from "./RateInfoPanel";
import { useWaitForTransactionReceipt } from "wagmi";
import { ActionButton } from "./ActionButton";
import TransactionResultModal from "./TransactionResultModal";
import { useBridgeTokens } from "../hooks/useBridgeTokens";
import { NetworkInfo } from "../services/ApiService";

interface TransactionConfirmationModalProps {
  onClose: () => void;
}

const TransactionConfirmationModal: React.FC<
  TransactionConfirmationModalProps
> = ({ onClose }) => {
  const [actionButtonTitle, setActionButtonTitle] = useState<string>(
    "Transfer Confirmation"
  );
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const {
    sourceNetwork,
    destinationNetwork,
    amount,
    amountReceive,
    sourceToken,
    destinationAddress,
    address: account,
  } = useInitialization();

  const {
    bridgeTokens,
    transactionHash: transferTxHash,
    status: transferStatus,
    receipt,
    error,
  } = useBridgeTokens();

  useEffect(() => {
    if (transferStatus === "success" && receipt?.blockNumber) {
      setActionButtonTitle("Approved");
    } else if (transferStatus === "error") {
      setActionButtonTitle("Error Transferring");
      console.error(error);
    } else if (transferStatus === "pending") {
      setActionButtonTitle("Transferring");
    }
  }, [transferStatus, receipt]);

  const handleTransferClick = () => {
    if (!sourceNetwork || !destinationNetwork || !sourceToken || !account) {
      return;
    }
    setIsDisabled(true);
    try {
      bridgeTokens(
        sourceNetwork,
        destinationNetwork?.name,
        sourceToken,
        amount,
        destinationAddress as string,
        sourceToken.symbol
      );
    } catch (e) {
      setActionButtonTitle("Transfer Failed");
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <GenericModal title="Transfer Confirmation" onClose={onClose}>
      <NetworkBalance
        icon={sourceNetwork?.icon}
        name={sourceNetwork?.name}
        subLabel={"Source Chain"}
        amount={`-${amount}`}
        amountLabel={sourceToken?.prettySymbol}
      />
      <NetworkBalance
        icon={destinationNetwork?.icon}
        name={destinationNetwork?.name}
        subLabel={"Destination Chain"}
        amount={`+${amountReceive}`}
        amountLabel={`(estimated) ${sourceToken?.prettySymbol}`}
      />

      <div className="flex flex-col w-full py-4 gap-2">
        <div className="flex rounded-lg px-2 py-1 text-sm justify-between bg-black">
          <span>Source:</span>
          <span>{account}</span>
        </div>
        <div className="flex rounded-lg px-2 py-1 text-sm justify-between bg-black">
          <span>Recipient:</span>
          <span>{destinationAddress}</span>
        </div>
      </div>
      <RateInfoPanel />

      <div className="mt-auto">
        <ActionButton
          title={actionButtonTitle}
          handler={handleTransferClick}
          disabled={isDisabled}
          errored={transferStatus === "error"}
        />
      </div>
      {(transferStatus === "error" || transferStatus === "success") && (
        <TransactionResultModal
          onClose={onClose}
          transactionHash={transferTxHash}
          transferStatus={transferStatus}
          error={error}
        />
      )}
    </GenericModal>
  );
};

export default TransactionConfirmationModal;
