import React from "react";

interface NetworkBalanceProps {
  icon?: string;
  name?: string;
  subLabel?: string;
  className?: string;
  amount?: string;
  amountLabel?: string;
}

const NetworkBalance: React.FC<NetworkBalanceProps> = ({
  icon,
  name,
  subLabel,
  amount,
  amountLabel,
}) => {
  return (
    <div
      className={`bg-gray-600 flex items-center p-1 m-1 w-full rounded-md
      `}
    >
      <div className="flex justify-between w-full">
        <div className="flex">
          <img src={icon} alt={`${name} icon`} className="w-8 h-8 mr-2" />
          <div className="flex flex-col">
            <span className="">{name}</span>
            <span className="text-xs text-gray-400">{subLabel}</span>
          </div>
        </div>
        <div className="flex flex-col px-2 items-end">
          <span className="">{amount}</span>
          <span className="text-xs text-gray-400">{amountLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkBalance;
