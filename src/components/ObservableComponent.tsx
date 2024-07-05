// src/components/ObservableComponent.tsx
import React, { useEffect, useState } from 'react';
import { state } from '../store';

interface AppState {
  sourceNetwork: string;
  destinationNetwork: string;
  tokenBalances: Record<string, string>;
  bridgeRate: string;
  fee: string;
  estimatedTimeOfArrival: string;
}

const ObservableComponent: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    sourceNetwork: '',
    destinationNetwork: '',
    tokenBalances: {},
    bridgeRate: '',
    fee: '',
    estimatedTimeOfArrival: '',
  });

  useEffect(() => {
    const subscription = state.subscribe(setAppState);
    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="bg-card p-6 rounded-lg shadow-md w-full max-w-lg mt-6">
      <div className="mb-4">
        <h2 className="text-xl mb-2">Application Details</h2>
        <p><strong>Source Network:</strong> {appState.sourceNetwork}</p>
        <p><strong>Destination Network:</strong> {appState.destinationNetwork}</p>
        <p><strong>Bridge Rate:</strong> {appState.bridgeRate}</p>
        <p><strong>Fee:</strong> {appState.fee}</p>
        <p><strong>Estimated Time of Arrival:</strong> {appState.estimatedTimeOfArrival}</p>
        <h3 className="text-lg mt-4">Token Balances:</h3>
        <ul>
          {Object.entries(appState.tokenBalances).map(([token, balance]) => (
            <li key={token}>{token}: {balance}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ObservableComponent;