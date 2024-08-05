import React from "react";

const Spinner = ({className = "w-8 h-8"}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className={`${className} border-4 border-solid border-gray-300 border-t-gray-800 dark:border-t-white rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default Spinner;
