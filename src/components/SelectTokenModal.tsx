// src/components/NetworkSelectorModal.tsx
import React, { useState, useEffect } from "react";
import GenericModal from "./GenericModal";
import NetworkLabel from "./NetworkLabel";
import { useInitialization } from "../InitializationContext";
import { TokenConfig } from "../services/AxelarService";

interface SelectTokenModalProps {
  onClose: () => void;
}

const SelectTokenModal: React.FC<SelectTokenModalProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { sourceNetworkTokens, loading, error, setToken } = useInitialization();

  const filteredTokens = sourceNetworkTokens.filter((token) =>
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectToken = (token: TokenConfig) => {
    setToken(token);
    onClose();
  };

  console.log("filteredTokens", filteredTokens);
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
        {filteredTokens.map((network) => (
          <NetworkLabel
            key={network.name}
            icon={network.icon}
            name={network.name}
            onClick={() => handleSelectToken(network)}
          />
        ))}
      </div>
    </GenericModal>
  );
};

export default SelectTokenModal;
