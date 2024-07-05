// src/App.jsx
import { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import BridgeForm from "./BridgeForm";
import "./index.css";

const App = () => {
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-white">
      <header className="top-bar bg-card flex justify-between items-center p-4 w-full">
        <div className="flex align-center">
          <img
            className="w-8 h-8 mr-1"
            src={"/src/assets/flow.png"}
            alt="Flow"
          />
          <h1 className="text-xl font-bold">flow</h1>
        </div>
        <div className="connect-button">
          <ConnectButton />
        </div>
      </header>
      <main className="p-4 w-full flex-1">
        <BridgeForm />
      </main>
    </div>
  );
};

export default App;
