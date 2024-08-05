import React, { useState, ChangeEvent, useEffect } from "react";
import "./index.css";
import Dropdown from "./components/Dropdown";
import NetworkSelectorModal from "./components/NetworkSelectorModal";
import { Address, isAddress } from "viem";
import SwapIcon from "./components/SwapIcon";
import { useInitialization } from "./InitializationContext";
import SelectTokenModal from "./components/SelectTokenModal";
import TransactionConfirmationModal from "./components/TransactionConfirmationModal";
import RateInfoPanel from "./components/RateInfoPanel";
import { ActionButton } from "./components/ActionButton";
import { useTokenApproval } from "./hooks/useTokenApproval";
import { DisplayErrorMessage } from "./components/DisplayErrorMessage";

const BridgeForm: React.FC = () => {
  const [isSourceModalOpen, setSourceModalOpen] = useState(false);
  const [isDestinationModalOpen, setDestinationModalOpen] = useState(false);
  const [isSelectTokenModalOpen, setSelectTokenModalOpen] = useState(false);
  const [isTransferringTokenModalOpen, setTransferringTokenModalOpen] =
    useState(false);
  const [error, setError] = useState<string>("");
  const [destAddrError, setDestAddrError] = useState<string>("");
  const [estimatedAmount, setEstimatedAmount] = useState<string>("");
  const [actionButtonTitle, setActionButtonTitle] = useState<string>(
    "Approve Token for Transfer"
  );
  const {
    sourceNetwork,
    destinationAddress,
    destinationNetwork,
    setDestinationAddress,
    amount,
    sourceToken,
    displayUserBalance,
    swapNetworks,
    setAmount,
    canSend,
    transferFee,
    address,
    config,
    loading,
  } = useInitialization();

  const {
    isApproved,
    approveToken,
    receipt,
    status: approvalStatus,
    error: approvalError,
  } = useTokenApproval(sourceToken, address as Address, sourceNetwork, config);

  useEffect(() => {
    if (transferFee?.fee) {
      const estAmount = Number(amount) - Number(transferFee?.fee);
      if (estAmount < 0 && error === "") {
        setError("Receive amount is negative");
      } else {
        setError("");
      }
      setEstimatedAmount(String(estAmount));
    }
  }, [transferFee?.fee, amount]);

  const openSourceModal = () => setSourceModalOpen(true);
  const closeSourceModal = () => setSourceModalOpen(false);

  const openDestinationModal = () => setDestinationModalOpen(true);
  const closeDestinationModal = () => setDestinationModalOpen(false);

  const openSelectTokenModal = () => setSelectTokenModalOpen(true);
  const closeSelectTokenModal = () => setSelectTokenModalOpen(false);

  const closeTransferringTokenModal = () =>
    setTransferringTokenModalOpen(false);

  const handleApprovalClick = () => {
    setActionButtonTitle("Waiting for signing");
    try {
      approveToken(amount);
    } catch (error) {
      console.error("Source and destination networks must be selected");
    } finally {
      setActionButtonTitle("Approving");
    }
  };

  useEffect(() => {
    if (approvalStatus === "success" && receipt?.blockNumber) {
      setActionButtonTitle("Approved");
    } else if (approvalStatus === "error") {
      setActionButtonTitle("Approve Token for Transfer");
    } else if (approvalStatus === "pending") {
      setActionButtonTitle("Approving");
    }
  }, [approvalStatus, receipt]);

  const handleTransferClick = () => {
    if (sourceNetwork && destinationNetwork && amount && destinationAddress) {
      setTransferringTokenModalOpen(true);
    } else {
      console.error("Source and destination networks must be selected");
    }
  };

  const handleAmountChange = (value) => {
    setAmount(value);
    if (!/^[0-9]*\.?[0-9]*$/.test(value)) {
      setError("Please enter a valid number");
    } else if (Number(value) > Number(displayUserBalance())) {
      setError("Amount greater than balance");
    } else {
      setError("");
    }

    const estAmount = Number(value) - Number(transferFee?.fee || 0);
    setEstimatedAmount(String(estAmount));
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

  const handleSwapNetworks = () => {
    if (!sourceNetwork || !destinationNetwork) {
      console.error("Source and destination networks must be selected");
      return;
    }
    swapNetworks();
  };

  const needsApproval = !isApproved(amount);

  console.log(
    "rendering form",
    needsApproval,
    approvalError?.message,
    approvalError
  );
  return (
    <div className="flex flex-col items-center min-h-screen w-full text-white p-4">
      <div className="p-6 rounded-xlg shadow-md w-full max-w-lg bg-gray-700">
        <div className="flex justify-start mb-4 items-center">
          <label className="block text-sm font-medium mr-4">From</label>
          <Dropdown
            icon={sourceNetwork?.icon}
            label={sourceNetwork?.name}
            onClick={openSourceModal}
          />
        </div>
        <div
          className={`flex flex-col bg-card p-4 rounded-xlg ${
            error ? "border border-red-500" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-400">
              Send:
            </label>
            <span
              className="text-sm text-gray-400 cursor-pointer"
              onClick={() => handleAmountChange(displayUserBalance())}
            >
              Max: {displayUserBalance()}
            </span>
          </div>
          <div className="flex items-center bg-card">
            <input
              type="text"
              className="w-full rounded text-white bg-card focus:outline-none focus:ring-0"
              value={amount}
              placeholder="0.0"
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            <Dropdown
              icon={sourceToken?.icon}
              label={sourceToken?.prettySymbol}
              onClick={openSelectTokenModal}
              className="flex justify-end"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <div className="flex justify-center items-center">
          <button
            className="bg-transparent p-2 rounded"
            onClick={handleSwapNetworks}
          >
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
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Receive (estimated):
            </label>
            <div className="flex items-center bg-card">
              <input
                type="string"
                value={estimatedAmount}
                placeholder="0.0"
                className="w-full mt-1 rounded bg-card text-white"
                disabled
              />
              <Dropdown
                icon={sourceToken?.icon}
                label={sourceToken?.prettySymbol}
                onClick={openSelectTokenModal}
                className="flex justify-end"
                disabled
              />
            </div>
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
            className="text-white bg-card w-full focus:outline-none focus:ring-0"
            value={destinationAddress}
            onChange={handleDestinationAddressChange}
          />
        </div>
        {destAddrError && (
          <p className="text-red-500 text-sm mt-1">{destAddrError}</p>
        )}
        <RateInfoPanel />
        {approvalStatus === "error" && (
          <div className="mt-2">
            <DisplayErrorMessage
              error={approvalError}
              text={"Error approving token, try again"}
            />
          </div>
        )}
        {needsApproval && (
          <ActionButton
            title={actionButtonTitle}
            handler={handleApprovalClick}
            disabled={!canSend || approvalStatus === "pending"}
            loading={loading}
          />
        )}
        {!needsApproval && (
          <ActionButton
            title="Transfer"
            handler={handleTransferClick}
            disabled={!canSend || loading}
            loading={loading}
          />
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
      {isTransferringTokenModalOpen && (
        <TransactionConfirmationModal onClose={closeTransferringTokenModal} />
      )}
    </div>
  );
};

export default BridgeForm;
