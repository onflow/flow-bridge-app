import React from "react";
import { useInitialization } from "../InitializationContext";
import InfoIcon from "./InfoIcon";
import Spinner from "./Spinner";

interface RateInfoPanelProps {}

const RateInfoPanel: React.FC<RateInfoPanelProps> = () => {
  const {
    sourceNetwork,
    destinationNetwork,
    amountReceive,
    sourceToken,
    bridgingFee,
    transferFee,
    loading,
  } = useInitialization();

  const tokenName = sourceToken?.prettySymbol || "Token";

  return (
    <div className="bg-card p-4 rounded-xlg mt-4 text-sm">
      <div className="text-white rounded-lg flex flex-col gap-4">
        <div className="col-span-1 flex justify-between">
          <p className="flex items-center text-gray-400">
            Bridge Rate
            <span className="ml-1 text-gray-500">
              <InfoIcon />
            </span>
          </p>
          <p>
            1 {tokenName} on{" "}
            <span className="text-green-500">{sourceNetwork?.name}</span> = 1{" "}
            {tokenName} on{" "}
            <span className="text-blue-500">{destinationNetwork?.name}</span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-gray-400">
            <p className="flex items-center whitespace-nowrap">
              Bridge Fees{" "}
              <span className="ml-1 text-gray-500">
                <InfoIcon />
              </span>
            </p>
          </div>
          <div className="relative flex items-center">
            {loading ? (
              <Spinner className="w-4 h-4 ml-auto" />
            ) : (
              <p className="ml-auto">
                {transferFee?.fee} {transferFee?.denom}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-400">Estimated Time of Arrival</p>
          <p>{sourceNetwork?.approxFinalityWaitTime} minutes</p>
        </div>
      </div>
    </div>
  );
};

export default RateInfoPanel;