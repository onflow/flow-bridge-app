// src/components/NetworkSelectorModal.tsx
import React, { useState, useEffect } from 'react';
import GenericModal from './GenericModal';
import NetworkLabel from './NetworkLabel';
import { setSourceNetwork, setDestinationNetwork, state } from '../store';
import ApiService from '../services/ApiService';

interface NetworkSelectorModalProps {
  onClose: () => void;
  isSource: boolean;
}

const NetworkSelectorModal: React.FC<NetworkSelectorModalProps> = ({ onClose, isSource }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceNetwork, setSourceNetworkState] = useState<string>('');

  useEffect(() => {
    const subscription = state.subscribe((state) => {
      setSourceNetworkState(state.sourceNetwork);
    });
    return () => subscription.unsubscribe();
  }, []);

  const networkList = isSource ? ApiService.getSourceNetworks() : ApiService.getDestinationNetworks(sourceNetwork);

  const filteredNetworks = networkList.filter(network =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNetworkSelect = (networkName: string) => {
    if (isSource) {
      setSourceNetwork(networkName);
    } else {
      setDestinationNetwork(networkName);
    }
    onClose();
  };

  return (
    <GenericModal title="Select Network" onClose={onClose}>
      <input
        type="text"
        placeholder="Search chain by name or chain ID"
        className="w-full p-2 mb-4 rounded bg-secondary text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        {filteredNetworks.map((network) => (
          <NetworkLabel
            key={network.name}
            icon={network.icon}
            name={network.name}
            onClick={() => handleNetworkSelect(network.name)}
          />
        ))}
      </div>
    </GenericModal>
  );
};

export default NetworkSelectorModal;