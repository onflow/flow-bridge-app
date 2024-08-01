// src/components/NetworkSelectorModal.tsx
import React from "react";
import GenericModal from "./GenericModal";
import { useInitialization } from "../InitializationContext";
import { CircleXIcon } from "./CircleXIcon";
import { UpArrowIcon } from "./UpArrowIcon";
import { ActionButton } from "./ActionButton";
import { ExternalLinkIcon } from "./ExternalLink";
import { type WriteContractErrorType } from "@wagmi/core";
import { DisplayErrorMessage } from "./DisplayErrorMessage";

interface TransactionConfirmationModalProps {
  onClose: () => void;
  transactionHash: string | undefined;
  transferStatus: string;
  error: WriteContractErrorType | null;
}

const TransactionConfirmationModal: React.FC<
  TransactionConfirmationModalProps
> = ({ onClose, transactionHash, transferStatus, error }) => {
  const { sourceNetwork } = useInitialization();

  let icon = <CircleXIcon />;
  let link = "";

  if (transactionHash) {
    icon = <UpArrowIcon />;
    link = `${sourceNetwork?.blockExplorer}/tx/${transactionHash}`;
  }

  return (
    <GenericModal title="" onClose={onClose}>
      <div className="flex flex-col h-full text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full flex items-center justify-center">
            {icon}
          </div>
        </div>
        <h2 className="mt-8 text-xl font-semibold mb-4">Transfer Submitted</h2>
        <p className="mb-8 text-md">
          {link &&
            `Please allow ${sourceNetwork?.approxFinalityWaitTime} minutes for the funds to arrive at your wallet on
          ${sourceNetwork?.name}.`}
          {transferStatus === "error" && (
            <div className="flex flex-col gap-4">
              <span>
                An error has occurred, Please start over to try again.
              </span>
              <span className="text-lg text-error">
                <DisplayErrorMessage error={error} text={"Error transferring tokens"} />
              </span>
            </div>
          )}
        </p>
        {link && (
          <span className="mb-8 flex items-center gap-1 justify-center">
            <a
              href={link}
              className="text-green-500 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View the transaction in the block explorer
            </a>
            <ExternalLinkIcon />
          </span>
        )}
        <div className="mt-auto">
          <ActionButton
            title="OK"
            handler={onClose}
            disabled={false}
            errored={false}
          />
        </div>
      </div>
    </GenericModal>
  );
};

export default TransactionConfirmationModal;
