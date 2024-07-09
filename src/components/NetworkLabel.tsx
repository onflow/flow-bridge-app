// src/components/NetworkLabel.tsx
import React from "react";

interface NetworkLabelProps {
  icon: string;
  name: string;
  selected?: boolean;
  onClick: () => void;
}

const NetworkLabel: React.FC<NetworkLabelProps> = ({
  icon,
  name,
  selected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-500 flex items-center p-1 m-1 w-full rounded-md ${
        selected
          ? "border border-blue-500 text-white"
          : "border border-transparent text-gray-400"
      }`}
    >
      <img src={icon} alt={`${name} icon`} className="w-6 h-6 mr-2" />
      <span>{name}</span>
    </button>
  );
};

export default NetworkLabel;
