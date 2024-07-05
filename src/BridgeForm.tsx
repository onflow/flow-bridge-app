// src/BridgeForm.tsx
import React, { useState, useEffect } from 'react';
import './index.css';
import Dropdown from './components/Dropdown';
import NetworkSelectorModal from './components/NetworkSelectorModal';
import ObservableComponent from './components/ObservableComponent';
import { state } from './store';
import ApiService from './services/ApiService';

const BridgeForm: React.FC = () => {
  const [isSourceModalOpen, setSourceModalOpen] = useState(false);
  const [isDestinationModalOpen, setDestinationModalOpen] = useState(false);
  const [sourceNetwork, setSourceNetwork] = useState<string>('');
  const [destinationNetwork, setDestinationNetwork] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    const subscription = state.subscribe(state => {
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
    ApiService.updateStoreForBridge(sourceNetwork, destinationNetwork, amount);
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-background text-white p-4">
      <div className="bg-card p-6 rounded-lg shadow-md w-full max-w-lg">
        <div className="flex justify-start mb-4 items-center">
          <label className="block text-sm font-medium mr-4">From</label>
          <Dropdown label={sourceNetwork} onClick={openSourceModal} />
        </div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium">Send:</label>
          <span className="text-sm">Max: --</span>
        </div>
        <div className="flex items-center mb-4">
          <input 
            type="number" 
            className="w-full mt-1 p-2 rounded bg-secondary text-white" 
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <Dropdown label="USDC" onClick={openSourceModal} />
        </div>
        <div className="flex justify-center items-center mb-4">
          <button className="bg-secondary p-2 rounded">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11H9v2H5v2h4v2h2v-2h4v-2h-4V7z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex items-center mb-4">
          <label className="block text-sm font-medium mr-4">To</label>
          <Dropdown label={destinationNetwork} onClick={openDestinationModal} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Receive (estimated):</label>
          <input type="number" className="w-full mt-1 p-2 rounded bg-secondary text-white" disabled />
        </div>
        <div className="p-4 mb-4 bg-secondary rounded">
          <ObservableComponent />
        </div>
        <button 
          className="w-full py-2 bg-primary text-white rounded hover:border-0"
          onClick={handleTransferClick}
        >
          Transfer
        </button>
      </div>
      {isSourceModalOpen && <NetworkSelectorModal onClose={closeSourceModal} isSource />}
      {isDestinationModalOpen && <NetworkSelectorModal onClose={closeDestinationModal} isSource={false} />}
    </div>
  );
};

export default BridgeForm;