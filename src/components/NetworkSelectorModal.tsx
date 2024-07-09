// src/components/NetworkSelectorModal.tsx
import React, { useState, useEffect } from 'react';
import GenericModal from './GenericModal';
import NetworkLabel from './NetworkLabel';
import { setSourceNetwork, setDestinationNetwork, state } from '../store';
import ApiService from '../services/ApiService';
import { useInitialization } from '../InitializationContext';
import { NetworkInfo } from '../services/AxelarService';

interface NetworkSelectorModalProps {
  onClose: () => void;
  isSource: boolean;
}

const NetworkSelectorModal: React.FC<NetworkSelectorModalProps> = ({ onClose, isSource }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceNetwork, setSourceNetworkState] = useState<NetworkInfo>();
  const { networks, loading, error } = useInitialization();
  
  useEffect(() => {
    const subscription = state.subscribe((state) => {
      setSourceNetworkState(state.sourceNetwork);
    });
    return () => subscription.unsubscribe();
  }, []);

  const filteredNetworks = networks.filter(network =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNetworkSelect = (network: NetworkInfo) => {
    if (isSource) {
      setSourceNetwork(network);
    } else {
      setDestinationNetwork(network);
    }
    onClose();
  };

  return (
    <GenericModal title="Select Network" onClose={onClose}>
      <input
        type="text"
        placeholder="Search chain by name or chain ID"
        className="w-full p-2 mb-4 rounded bg-secondary text-white focus:outline-none focus:ring-primary focus:ring-opacity-50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        {filteredNetworks.map((network) => (
          <NetworkLabel
            key={network.name}
            icon={network.icon}
            name={network.name}
            onClick={() => handleNetworkSelect(network)}
          />
        ))}
      </div>
    </GenericModal>
  );
};

export default NetworkSelectorModal;