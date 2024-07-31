// src/components/Dropdown.tsx
import React from "react";
import { CarrotIcon } from "./CarrotIcon";

interface DropdownProps {
  label: string | undefined;
  icon: string | undefined;
  onClick: () => void;
  disabled?: boolean;
  className?: string; 
}

const Dropdown: React.FC<DropdownProps> = ({
  icon,
  label,
  onClick,
  disabled,
  className = "",
}) => {
  if (!icon || !label) {
    return <div className="relative" />;
  }
  return (
    <div className={`relative w-full ${className}`}>
      <button
        onClick={onClick}
        className=" py-2 px-4 rounded-xlg bg-secondary text-white rounded inline-flex items-center whitespace-nowrap flex flex-end p-0"
        disabled={disabled}
      >
        <img src={icon} alt={`${label} icon`} className="w-6 h-6 mr-2" />
        {label}
        {!disabled && <CarrotIcon />}
      </button>
    </div>
  );
};

export default Dropdown;
