// src/components/NetworkSelectorModal.tsx
import React, { useState, useEffect } from "react";
import GenericModal from "./GenericModal";
import { useInitialization } from "../InitializationContext";
import NetworkBalance from "./NetworkBalance";
import RateInfoPanel from "./RateInfoPanel";
import { useWaitForTransactionReceipt } from "wagmi";
import { ActionButton } from "./ActionButton";
import TransactionResultModal from "./TransactionResultModal";

interface TransactionConfirmationModalProps {
  onClose: () => void;
}

const TransactionConfirmationModal: React.FC<
  TransactionConfirmationModalProps
> = ({ onClose }) => {
  const {
    sourceNetwork,
    destinationNetwork,
    amount,
    amountReceive,
    sourceToken,
    destinationAddress,
    address: account,
    isApproved,
    sendTokens,
    approveTokenAmount,
    approvalTxHash,
    transferTxHash,
    config,
    approvalStatus,
    transferStatus,
  } = useInitialization();

  const { error: approvalError } = useWaitForTransactionReceipt({
    hash: approvalTxHash,
    chainId: sourceNetwork?.id,
    config,
  });

  const { error: transferError } = useWaitForTransactionReceipt({
    hash: transferTxHash,
    chainId: sourceNetwork?.id,
    config,
  });

  console.log("error", approvalError, transferError);
  const handleTransferClick = () => {
    // monitor transaction and add animation
    sendTokens();
  };

  const handleApproveClick = () => {
    // monitor transaction and add animation
    approveTokenAmount(amount);
  };

  const approved = isApproved(amount);

  const conf = {
    title: "Transfer Confirmation",
    handler: handleTransferClick,
    disabled: !!transferTxHash,
  };

  if (!approved) {
    conf.title = "Approve Transfer Amount";
    conf.handler = handleApproveClick;
    conf.disabled = !!approvalTxHash;

    if (approvalStatus === "pending") {
      conf.title = "Approving";
    } else if (approvalStatus === "success") {
      conf.title = "Approved";
    } else if (approvalStatus === "error") {
      conf.title = "Approval Failed";
      console.error("Approval failed", approvalError);
    }
  }

  if (approved) {
    if (transferStatus === "pending") {
      conf.title = "Transferring";
    } else if (transferStatus === "success") {
      conf.title = "Transfer Success";
    } else if (transferStatus === "error") {
      conf.title = "Transfer Failed";
      console.error("Transfer failed", transferError);
    }
  }

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
      {!approved && (
        <div className="text-center text-sm text-gray-400 p-4">
          <p>
            You need to approve the bridging contract in order to transfer{" "}
            {amount} {sourceToken?.prettySymbol} before you can proceed.
          </p>
        </div>
      )}
      <div className="mt-auto">
        <ActionButton
          title={conf.title}
          handler={conf.handler}
          disabled={conf.disabled}
        />
      </div>
      {transferTxHash && <TransactionResultModal onClose={onClose} />}
    </GenericModal>
  );
};

export default TransactionConfirmationModal;
