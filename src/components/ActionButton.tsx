import React from "react";

export const ActionButton = ({
  handler,
  title,
  disabled,
  errored,
}: {
  title: string;
  handler: () => void;
  disabled?: boolean;
  errored?: boolean;
}) => {
  let buttonClasses = "mt-4 w-full p-4 text-action rounded-lg";

  if (errored) {
    buttonClasses += " bg-red-500";
  } else if (disabled) {
    buttonClasses += " bg-opacity-50 bg-primary-highlight cursor-not-allowed";
  } else {
    buttonClasses +=
      " bg-primary-highlight hover:bg-opacity-80 active:scale-95 transition-transform duration-50";
  }

  return (
    <button className={buttonClasses} onClick={handler} disabled={disabled}>
      {title}
    </button>
  );
};
