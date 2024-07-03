// src/BridgeForm.tsx
import React, { useState } from 'react';
import './index.css';
import Dropdown from './components/Dropdown';
import NetworkSelectorModal from './components/NetworkSelectorModal';

const BridgeForm: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className="flex flex-col items-center min-h-screen w-full bg-background text-white p-4">
      <div className="bg-card p-6 rounded-lg shadow-md w-full max-w-lg">
        <div className="flex justify-between mb-4">
          <Dropdown label="From" onClick={openModal} />
          <Dropdown label="To" onClick={openModal} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Send:</label>
          <input type="number" className="w-full mt-1 p-2 rounded bg-secondary text-white" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Receive (estimated):</label>
          <input type="number" className="w-full mt-1 p-2 rounded bg-secondary text-white" disabled />
        </div>
        <div className="mb-4">
          <div className="text-sm">Bridge Ratio: 1 USDC on Flow = 1 USDC on Ethereum</div>
          <div className="text-sm">Fee: - USDC</div>
          <div className="text-sm">Estimated Time of Arrival: 10 minutes</div>
        </div>
        <button className="w-full py-2 bg-primary text-white rounded">Transfer</button>
      </div>
      {isModalOpen && <NetworkSelectorModal onClose={closeModal} />}
    </div>
  );
};

export default BridgeForm;