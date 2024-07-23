// src/components/NetworkLabel.tsx
import React from "react";

interface NetworkLabelProps {
  icon?: string;
  name?: string;
  selected?: boolean;
  onClick?: () => void;
  subLabel?: string;
  className?: string;
}

const NetworkLabel: React.FC<NetworkLabelProps> = ({
  icon,
  name,
  selected,
  onClick = () => {},
  subLabel,
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-gray-600 flex items-center p-1 m-1 w-full rounded-md ${
        selected
          ? "border text-white"
          : "border border-transparent text-gray-400"
      }`}
    >
      <div className="flex flex-row">
        <img src={icon} alt={`${name} icon`} className="w-6 h-6 mr-2" />
        <div className="flex flex-col items-start">
          {name && <span className="">{name}</span>}
          {subLabel && (
            <span className="text-xs text-gray-400">{subLabel}</span>
          )}
        </div>
      </div>
    </button>
  );
};

export default NetworkLabel;
