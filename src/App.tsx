// src/App.jsx
import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import BridgeForm from "./BridgeForm";
import "./index.css";
import TransactionHistoryModal from "./components/TransactionHistoryModal";

const App = () => {
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add("dark");
  }, []);
  const [isShowHistory, setIsShowHistoryModal] = useState(false);
  const closeTransactionHistoryModal = () =>
    setIsShowHistoryModal(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-white">
      <header className="top-bar bg-background flex justify-between items-center p-4 w-full">
        <div className="flex align-center items-center">
          <img
            className="w-8 h-8 mr-1"
            src={"/assets/flow.png"}
            alt="Flow"
          />
          <h1 className="text-xl font-bold">flow</h1>
          <button
            onClick={() => setIsShowHistoryModal(!isShowHistory)}
            className="ml-4 text-white bg-transparent items-start"
          >
            <h1 className="text-xl font-bold">History</h1>
          </button>
        </div>
        <div className="connect-button">
          <ConnectButton />
        </div>
      </header>
      <main className="p-4 w-full flex-1">
        <BridgeForm />
        {isShowHistory && <TransactionHistoryModal onClose={closeTransactionHistoryModal} />}
      </main>
    </div>
  );
};

export default App;
