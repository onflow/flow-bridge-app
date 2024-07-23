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
      className={`flex items-center p-1 my-2 w-full border-b border-gray-600`}
    >
      <div className="flex justify-between w-full">
        <div className="flex">
          <img src={icon} alt={`${name} icon`} className="w-8 h-8 mr-2" />
          <div className="flex flex-col">
            <span className="">{name}</span>
            <span className="text-xs">{subLabel}</span>
          </div>
        </div>
        <div className="flex flex-col px-2 items-end">
          <span className="">{amount}</span>
          <span className="text-xs">{amountLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkBalance;
