import React, { useEffect } from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useLocation, Link } from 'react-router-dom';
import { useGA } from './hooks/useGA';
import BridgeForm from "./BridgeForm";
import "./index.css";
import TransactionHistoryModal from "./components/TransactionHistoryModal";
import { Routes, Route } from "react-router-dom";
import Terms from './Terms';
import Privacy from './Privacy';

const App = () => {
  const location = useLocation();
  const { sendPageView } = useGA();

  useEffect(() => {
    sendPageView(location.pathname + location.search);
  }, [location, sendPageView]);

  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  const [isShowHistory, setIsShowHistoryModal] = React.useState(false);
  const closeTransactionHistoryModal = () => setIsShowHistoryModal(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-white">
      <header className="top-bar bg-background flex justify-between items-center p-4 w-full sticky top-0 z-10">
        <div className="flex align-center items-center">
          <Link to="/" className="flex items-center">
            <img className="w-8 h-8 mr-1" src={"/assets/flow.png"} alt="Flow" />
            <h1 className="text-xl font-bold text-white">flow</h1>
          </Link>
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
      <main className="p-4 w-full flex-1 overflow-auto bg-background">
        <Routes>
          <Route path="/" element={<BridgeForm />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        {isShowHistory && (
          <TransactionHistoryModal onClose={closeTransactionHistoryModal} />
        )}
      </main>
      <footer className="bg-background p-4 text-center sticky bottom-0 w-full">
        <Link to="/terms" className="text-white mx-2 hover:underline text-sm font-bold">Terms</Link>
        <Link to="/privacy" className="text-white mx-2 hover:underline text-sm font-bold">Privacy</Link>
      </footer>
    </div>
  );
};

export default App;
