import React, { useState, useEffect, ChangeEvent } from "react";
import "./index.css";
import Dropdown from "./components/Dropdown";
import NetworkSelectorModal from "./components/NetworkSelectorModal";
import { isAddress } from "viem";
import SwapIcon from "./components/SwapIcon";
import InfoIcon from "./components/InfoIcon";
import { useInitialization } from "./InitializationContext";
import SelectTokenModal from "./components/SelectTokenModal";

const BridgeForm: React.FC = () => {
  const [isSourceModalOpen, setSourceModalOpen] = useState(false);
  const [isDestinationModalOpen, setDestinationModalOpen] = useState(false);
  const [isSelectTokenModalOpen, setSelectTokenModalOpen] = useState(false);

  const [error, setError] = useState<string>("");
  const [destAddrError, setDestAddrError] = useState<string>("");
  const {
    sourceNetwork,
    destinationAddress,
    destinationNetwork,
    setDestinationAddress,
    setAmount,
    amount,
    setApproval,
    sendTokens,
    isApproved,
    amountReceive,
    isApproving,
    isSending,
    canSend,
    isCheckingApproval,
    sourceToken,
    displayUserBalance,
  } = useInitialization();

  const openSourceModal = () => setSourceModalOpen(true);
  const closeSourceModal = () => setSourceModalOpen(false);

  const openDestinationModal = () => setDestinationModalOpen(true);
  const closeDestinationModal = () => setDestinationModalOpen(false);

  const openSelectTokenModal = () => setSelectTokenModalOpen(true);
  const closeSelectTokenModal = () => setSelectTokenModalOpen(false);

  const handleApprovalClick = () => {
    if (sourceNetwork && amount) {
      setApproval();
    } else {
      console.error("Source and amount must be selected");
    }
  };
  const handleTransferClick = () => {
    if (sourceNetwork && destinationNetwork && amount && destinationAddress) {
      sendTokens();
    } else {
      console.error("Source and destination networks must be selected");
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setError("");
    } else {
      setError("Please enter a valid number");
    }
  };

  const handleDestinationAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestinationAddress(value);
    if (isAddress(value)) {
      setDestAddrError("");
    } else {
      setDestAddrError("Please enter a valid address");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full text-white p-4">
      <div className="p-6 rounded-xlg shadow-md w-full max-w-lg bg-gray-600">
        <div className="flex justify-start mb-4 items-center">
          <label className="block text-sm font-medium mr-4">From</label>
          <Dropdown
            icon={sourceNetwork?.icon}
            label={sourceNetwork?.name}
            onClick={openSourceModal}
          />
        </div>
        <div
          className={`bg-card p-4 rounded-xlg ${
            error ? "border border-red-500" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Send:
            </label>
            <span
              className="text-sm text-gray-400 cursor-pointer"
              onClick={() => setAmount(displayUserBalance())}
            >
              Max: {displayUserBalance()}
            </span>
          </div>
          <div className="flex items-center mb-4 bg-card">
            <input
              type="text"
              className="w-full mt-1 p-2 rounded text-white bg-card focus:outline-none focus:ring-0"
              value={amount || "0.0"}
              onChange={handleAmountChange}
            />
            <Dropdown
              icon={sourceToken?.icon}
              label={sourceToken?.name}
              onClick={openSelectTokenModal}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <div className="flex justify-center items-center">
          <button className="bg-transparent p-2 rounded">
            <SwapIcon />
          </button>
        </div>

        <div className="flex items-center mb-4">
          <label className="block text-sm font-medium mr-8">To</label>
          <Dropdown
            icon={destinationNetwork?.icon}
            label={destinationNetwork?.name}
            onClick={openDestinationModal}
          />
        </div>
        <div className="bg-card p-4 rounded-xlg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Receive (estimated):
            </label>
            <input
              type="number"
              value={amountReceive}
              className="w-full mt-1 p-2 rounded bg-card text-white"
              disabled
            />
          </div>
        </div>
        <div className="bg-card p-4 rounded-xlg mt-4">
          <div className="flex items-center mb-4">
            <label className="block text-sm font-medium mr-2 text-gray-400">
              Recipient address on {destinationNetwork?.name} (do NOT send funds
              to exchanges)
            </label>
          </div>
          <input
            type="text"
            className="mb-4 text-white bg-card w-full focus:outline-none focus:ring-0"
            value={destinationAddress}
            onChange={handleDestinationAddressChange}
          />
        </div>
        {destAddrError && (
          <p className="text-red-500 text-sm mt-1">{destAddrError}</p>
        )}
        <div className="bg-card p-4 rounded-xlg mt-4">
          <div className="text-white rounded-md flex flex-col gap-4">
            <div className="col-span-1 flex justify-between">
              <p className="text-gray-400">Bridge Rate</p>
              <p>
                1 USDC on <span className="text-green-500">Flow</span> = 1 USDC
                on <span className="text-blue-500">Ethereum</span>
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
        {isCheckingApproval && (
          <p className="text-gray-400 text-sm mt-4">
            Checking approval status...
          </p>
        )}
        {!isApproved && (
          <button
            className={`w-full mt-4 py-2 bg-primary-highlight text-action rounded-lg ${
              isApproving
                ? "disabled:opacity-50 disabled:cursor-not-allowed"
                : "hover:bg-primary-highlight-dark"
            }`}
            onClick={handleApprovalClick}
            disabled={isApproving}
          >
            {isApproving ? "Approving ..." : "Approve"}
          </button>
        )}

        {isApproved && (
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
        )}
      </div>

      {isSourceModalOpen && (
        <NetworkSelectorModal onClose={closeSourceModal} isSource />
      )}
      {isDestinationModalOpen && (
        <NetworkSelectorModal
          onClose={closeDestinationModal}
          isSource={false}
        />
      )}
      {isSelectTokenModalOpen && (
        <SelectTokenModal onClose={closeSelectTokenModal} />
      )}
    </div>
  );
};

export default BridgeForm;
