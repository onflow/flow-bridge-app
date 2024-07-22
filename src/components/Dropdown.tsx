// src/components/Dropdown.tsx
import React from "react";

interface DropdownProps {
  label: string | undefined;
  icon: string | undefined;
  onClick: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ icon, label, onClick }) => {
  if (!icon || !label) {
    return  <div className="relative" />
  }
  return (
    <div className="relative">
      <button
        onClick={onClick}
        className="rounded-xlg bg-secondary text-white py-2 px-4 rounded inline-flex items-center w-full whitespace-nowrap"
      >
        <img src={icon} alt={`${label} icon`} className="w-6 h-6 mr-2" />

        {label}
        <svg className="ml-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default Dropdown;
