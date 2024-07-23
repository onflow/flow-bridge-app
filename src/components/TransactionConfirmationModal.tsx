// src/components/NetworkSelectorModal.tsx
import React, { useState, useEffect } from "react";
import GenericModal from "./GenericModal";
import { useInitialization } from "../InitializationContext";
import NetworkBalance from "./NetworkBalance";
import RateInfoPanel from "./RateInfoPanel";

interface TransactionConfirmationModalProps {
  onClose: () => void;
}

const TransactionConfirmationModal: React.FC<
  TransactionConfirmationModalProps
> = ({ onClose }) => {
  const {
    loading,
    error,
    canSend,
    isSending,
    sourceNetwork,
    destinationNetwork,
    amount,
    amountReceive,
    sourceToken,
    destinationAddress,
    address: account,
  } = useInitialization();

  console.log("token", sourceToken);
  const handleTransferClick = () => {
    // monitor transaction and add animation
  };

  return (
    <GenericModal title="Transfer Confirmation" onClose={onClose}>
      <NetworkBalance
        icon={sourceNetwork?.icon}
        name={sourceNetwork?.name}
        subLabel={"Source Chain"}
        amount={amount}
        amountLabel={sourceToken?.prettySymbol}
      />
      <NetworkBalance
        icon={destinationNetwork?.icon}
        name={destinationNetwork?.name}
        subLabel={"Destination Chain"}
        amount={amountReceive}
        amountLabel={`(estimated) ${sourceToken?.prettySymbol}`}
      />
      
      <div className="flex flex-col w-full py-4">
        <div className="flex py-1 text-sm justify-between">
          <span>Source:</span>
          <span>{account}</span>
        </div>
        <div className="flex py-1 text-sm justify-between">
          <span>Recipient:</span>
          <span>{destinationAddress}</span>
        </div>
      </div>
      <RateInfoPanel />
      <div className="">
        <button
          className={`w-full mt-4 py-2 bg-primary-highlight text-action rounded-lg ${
            canSend
              ? "hover:bg-primary-highlight-dark"
              : "disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
          onClick={handleTransferClick}
          disabled={!canSend}
        >
          {isSending ? "Transferring ..." : "Transfer"}
        </button>
      </div>
    </GenericModal>
  );
};

export default TransactionConfirmationModal;
