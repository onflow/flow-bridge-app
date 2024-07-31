// src/components/SelectTokenModal.tsx
import React, { useState } from "react";
import GenericModal from "./GenericModal";
import TokenLabel from "./TokenLabel";
import { useInitialization } from "../InitializationContext";
import { TokenConfig } from "../services/ApiService";

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

  return (
    <GenericModal title="Select Token" onClose={onClose}>
      <input
        type="text"
        placeholder="Search tokens by name"
        className="w-full p-2 mb-4 rounded bg-secondary text-white focus:outline-none focus:ring-primary focus:ring-opacity-50"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-2">
        {filteredTokens.map((token) => (
          <TokenLabel
            key={token.name}
            token={token}
            onClick={() => handleSelectToken(token)}
          />
        ))}
      </div>
    </GenericModal>
  );
};

export default SelectTokenModal;