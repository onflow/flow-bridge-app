// src/components/NetworkSelectorModal.tsx
import React, { useState, useEffect } from "react";
import GenericModal from "./GenericModal";
import { useInitialization } from "../InitializationContext";
import NetworkBalance from "./NetworkBalance";
import InfoIcon from "./InfoIcon";

interface RateInfoPanelProps {}

const RateInfoPanel: React.FC<RateInfoPanelProps> = () => {
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
    bridgingFee,
    transferFee,
  } = useInitialization();

  const tokenName = sourceToken?.prettySymbol || "Token";
  return (
    <div className="bg-card p-4 rounded-xlg mt-4 text-sm">
      <div className="text-white rounded-lg flex flex-col gap-4">
        <div className="col-span-1 flex justify-between">
          <p className="flex items-center text-gray-400">
            Bridge Rate
            <span className="ml-1 text-gray-500">
              <InfoIcon />
            </span>
          </p>
          <p>
            1 {tokenName} on{" "}
            <span className="text-green-500">{sourceNetwork?.name}</span> ={" "}
            1 {tokenName} on{" "}
            <span className="text-blue-500">{destinationNetwork?.name}</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p className="flex items-center text-gray-400">
            Bridge Fees{" "}
            <span className="ml-1 text-gray-500">
              <InfoIcon />
            </span>
          </p>
          <p>{transferFee}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Estimated Time of Arrival</p>
          <p>15 minutes</p>
        </div>
      </div>
    </div>
  );
};

export default RateInfoPanel;
