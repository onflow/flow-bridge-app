// src/components/NetworkSelectorModal.tsx
import React, { useState } from "react";
import GenericModal from "./GenericModal";
import NetworkLabel from "./NetworkLabel";

interface NetworkSelectorModalProps {
  onClose: () => void;
}

const networkList = [
  { name: "Ethereum Mainnet", icon: "/src/assets/ethereum.png" },
  { name: "BNB Chain", icon: "/src/assets/bnb.png" },
  { name: "Avalanche", icon: "/src/assets/avalanche.png" },
  { name: "Polygon PoS", icon: "/src/assets/polygon.png" },
  { name: "Fantom", icon: "/src/assets/fantom.png" },
  // Add more networks as needed
];

const NetworkSelectorModal: React.FC<NetworkSelectorModalProps> = ({
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);

  const filteredNetworks = networkList.filter((network) =>
    network.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <GenericModal title="Select Destination Chain" onClose={onClose}>
      <input
        type="text"
        placeholder="Search chain by name or chain ID"
        className="w-full p-2 mb-4 rounded bg-secondary text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <p className="text-sm text-gray-400 mb-4">
        Below shows the destination chains that enable at least one token
        transfer from Flow Mainnet. More chains can be found if you select other
        source chains.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {filteredNetworks.map((network) => (
          <NetworkLabel
            key={network.name}
            icon={network.icon}
            name={network.name}
            selected={selectedNetwork === network.name}
            onClick={() => setSelectedNetwork(network.name)}
          />
        ))}
      </div>
    </GenericModal>
  );
};

export default NetworkSelectorModal;
