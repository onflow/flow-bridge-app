import React, { useState, useEffect, ChangeEvent } from "react";
import "./index.css";
import Dropdown from "./components/Dropdown";
import NetworkSelectorModal from "./components/NetworkSelectorModal";
import ObservableComponent from "./components/ObservableComponent";
import { state } from "./store";
import ApiService from "./services/ApiService";
import SwapIcon from "./components/SwapIcon";
import InfoIcon from "./components/InfoIcon";
import { NetworkInfo } from "./services/AxelarService";

const BridgeForm: React.FC = () => {
  const [isSourceModalOpen, setSourceModalOpen] = useState(false);
  const [isDestinationModalOpen, setDestinationModalOpen] = useState(false);
  const [sourceNetwork, setSourceNetwork] = useState<NetworkInfo>();
  const [destinationNetwork, setDestinationNetwork] = useState<NetworkInfo>();
  const [amount, setAmount] = useState<string>("0.0");
  const [amountReceive, setAmountReceive] = useState<string>("0.0");
  const [destinationAddress, setDestinationAddress] = useState<string>("0x");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const subscription = state.subscribe((state) => {
      setSourceNetwork(state.sourceNetwork);
      setDestinationNetwork(state.destinationNetwork);
    });
    return () => subscription.unsubscribe();
  }, []);

  const openSourceModal = () => setSourceModalOpen(true);
  const closeSourceModal = () => setSourceModalOpen(false);

  const openDestinationModal = () => setDestinationModalOpen(true);
  const closeDestinationModal = () => setDestinationModalOpen(false);

  const handleTransferClick = () => {
    if (sourceNetwork && destinationNetwork) {
      ApiService.updateStoreForBridge(
        sourceNetwork,
        destinationNetwork,
        amount
      );
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
            <span className="text-sm text-gray-400">Max: --</span>
          </div>
          <div className="flex items-center mb-4 bg-card">
            <input
              type="text"
              className="w-full mt-1 p-2 rounded text-white bg-card focus:outline-none focus:ring-0"
              value={amount || "0.0"}
              onChange={handleAmountChange}
            />
            <Dropdown icon={"TODO"} label="USDC" onClick={openSourceModal} />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        <div className="flex justify-center items-center">
          <button className="bg-transparent p-2 rounded">
            <SwapIcon />
          </button>
        </div>

        <div className="flex items-center mb-4">
          <label className="block text-sm font-medium mr-2">To</label>
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
          <div className="mb-4">{destinationAddress}</div>
        </div>

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

        <button
          className="w-full mt-4 py-2 bg-primary-highlight text-action rounded-lg"
          onClick={handleTransferClick}
        >
          Transfer
        </button>
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
      <div className="p-4 mt-4 rounded">
        <ObservableComponent />
      </div>
    </div>
  );
};

export default BridgeForm;
