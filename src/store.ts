// src/store.ts
import { BehaviorSubject } from 'rxjs';
import ApiService from './services/ApiService';

interface AppState {
  sourceNetwork: string;
  destinationNetwork: string;
  tokenBalances: Record<string, string>;  // Updated to string
  bridgeRate: string;
  fee: string;
  estimatedTimeOfArrival: string;
}

const initialState: AppState = {
  sourceNetwork: 'Flow Mainnet',
  destinationNetwork: 'Ethereum Mainnet',
  tokenBalances: {},
  bridgeRate: '1 USDC on Flow = 1 USDC on Ethereum',
  fee: '- USDC',
  estimatedTimeOfArrival: '10 minutes',
};

const state$ = new BehaviorSubject<AppState>(initialState);

export const setSourceNetwork = (network: string) => {
  state$.next({ ...state$.value, sourceNetwork: network });
};

export const setDestinationNetwork = (network: string) => {
  state$.next({ ...state$.value, destinationNetwork: network });
};

export const setTokenBalances = (balances: Record<string, string>) => {
  state$.next({ ...state$.value, tokenBalances: balances });
};

export const setBridgeRate = (rate: string) => {
  state$.next({ ...state$.value, bridgeRate: rate });
};

export const setFee = (fee: string) => {
  state$.next({ ...state$.value, fee: fee });
};

export const setEstimatedTimeOfArrival = (time: string) => {
  state$.next({ ...state$.value, estimatedTimeOfArrival: time });
};

export const state = state$.asObservable();

// Initialize the store with default values
ApiService.updateStoreForBridge('Flow Mainnet', 'Ethereum Mainnet', 100);