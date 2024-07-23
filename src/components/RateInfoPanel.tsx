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
  } = useInitialization();

  return (
    <div className="bg-card p-4 rounded-xlg mt-4">
      <div className="text-white rounded-md flex flex-col gap-4">
        <div className="col-span-1 flex justify-between">
          <p className="text-gray-400">Bridge Rate</p>
          <p>
            1 USDC on <span className="text-green-500">Flow</span> = 1 USDC on{" "}
            <span className="text-blue-500">Ethereum</span>
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400 flex items-center">
            Fee{" "}
            <span className="ml-1 text-gray-500">
              <InfoIcon />
            </span>
          </p>
          <p>- USDC</p>
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
