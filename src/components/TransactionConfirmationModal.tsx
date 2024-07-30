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
    sendTokens,
  } = useInitialization();

  const handleTransferClick = () => {
    // monitor transaction and add animation
    sendTokens();
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
        <button
          className={`w-full mt-4 p-4 bg-primary-highlight text-action rounded-lg ${
            canSend
              ? "hover:bg-primary-highlight-dark"
              : "disabled:opacity-50 disabled:cursor-not-allowed"
          }`}
          onClick={handleTransferClick}
          disabled={!canSend}
        >
          {isSending ? "Transferring ..." : "Confirm Transfer"}
        </button>
      </div>
    </GenericModal>
  );
};

export default TransactionConfirmationModal;
