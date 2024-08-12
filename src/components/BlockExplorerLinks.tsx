import React, { useEffect, useState } from "react";
import { useInitialization } from "../InitializationContext";
import { ExternalLinkLargeIcon } from "./ExternalLinkLargeIcon";

export const BlockExplorerLinks = () => {
  const { address, sourceNetwork, destinationNetwork, destinationAddress } =
    useInitialization();

  const [destLink, setDestLink] = useState("");
  const [sourceLink, setSourceLink] = useState("");

  useEffect(() => {
    if (sourceNetwork?.blockExplorer?.url) {
      setSourceLink(`${sourceNetwork?.blockExplorer?.url}/address/${address}`);
    }
    if (destinationNetwork?.blockExplorer?.url) {
      setDestLink(
        `${destinationNetwork?.blockExplorer?.url}/address/${destinationAddress}`
      );
    }
  }, [address, sourceNetwork?.id, destinationNetwork?.id, destinationAddress]);

  return (
    <div className="flex flex-col h-full text-center w-full">
      {sourceLink && (
        <span className="flex items-center gap-1 justify-center">
          {`${sourceNetwork?.name} block explorer:`}
          <a
            href={destLink}
            className="flex text-green-500 hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`View source address`}
          <ExternalLinkLargeIcon />
          </a>
        </span>
      )}
      {destLink && (
        <span className="flex items-center gap-1 justify-center">
          {`${destinationNetwork?.name} block explorer:`}
          <a
            href={destLink}
            className="flex text-green-500 hover:no-underline whitespace-nowrap"
            target="_blank"
            rel="noopener noreferrer"
          >
            {`View destination address`}
            <ExternalLinkLargeIcon />
          </a>
          <div className="mt-auto">
          </div>
        </span>
      )}
    </div>
  );
};
