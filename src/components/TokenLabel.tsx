// src/components/TokenLabel.tsx
import React from "react";
import { TokenConfig } from "../services/ApiService";
import { useErc20Token } from "../hooks/useErc20Token";

interface TokenLabelProps {
  token: TokenConfig;
  onClick: () => void;
}

const TokenLabel: React.FC<TokenLabelProps> = ({ token, onClick }) => {
  const { name, symbol, icon, address } = token;
  const { balance } = useErc20Token(token);

  return (
    <button
      onClick={onClick}
      className="rounded bg-gray-600 flex items-center w-full rounded-md border border-transparent text-gray-400 hover:bg-gray-500"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center">
          <img src={icon} alt={`${name} icon`} className="w-6 h-6 mr-2" />
          <div className="flex flex-col items-start">
            {name && <span className="text-white">{name}</span>}
            {symbol && <span className="text-xs text-gray-400">{symbol} </span>}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-white">{balance}</span>
          {address && <span className="text-[0.5rem]">{address}</span>}
        </div>
      </div>
    </button>
  );
};

export default TokenLabel;
