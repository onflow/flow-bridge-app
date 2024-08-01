import React from "react";
import { type WriteContractErrorType } from "@wagmi/core";

interface DisplayErrorMessageProps {
  text: string;
  error: WriteContractErrorType | null;
}
export const DisplayErrorMessage: React.FC<DisplayErrorMessageProps> = ({
  text,
  error,
}) => {
  let readableError = error?.message || "";
  if (readableError.indexOf("denied transaction signature") !== -1) {
    readableError = "Transaction signature denied.";
  }
  return (
    <div className="text-error flex flex-col items-center justify-center text-sm">
      <span>{text}: {readableError}</span>
    </div>
  );
};
