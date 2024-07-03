// src/App.jsx
import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import BridgeForm from './BridgeForm';
import './index.css';

const App = () => {
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-white">
      <header className="top-bar bg-card flex justify-between items-center p-4 w-full">
        <h1 className="text-xl">Flow</h1>
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