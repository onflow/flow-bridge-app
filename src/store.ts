// src/store.ts
import { BehaviorSubject } from "rxjs";
import { AxelarService, NetworkInfo } from "./services/AxelarService";

export interface AppState {
  sourceNetwork: NetworkInfo;
  destinationNetwork: NetworkInfo;
  tokenBalances: Record<string, string>;
  bridgeRate: string;
  fee: string;
  estimatedTimeOfArrival: string;
  networks: NetworkInfo[]; // Add networks to the state
}

const initialState: AppState = {
  sourceNetwork: { name: "Flow Mainnet", icon: "", id: 0, assets: {} },
  destinationNetwork: { name: "Ethereum Mainnet", icon: "", id: 0, assets: {} },
  tokenBalances: {},
  bridgeRate: "1 USDC on Flow = 1 USDC on Ethereum",
  fee: "- USDC",
  estimatedTimeOfArrival: "10 minutes",
  networks: [], // Initialize networks as an empty array
};

const state$ = new BehaviorSubject<AppState>(initialState);

export const setSourceNetwork = (network: NetworkInfo) => {
  state$.next({ ...state$.value, sourceNetwork: network });
};

export const setDestinationNetwork = (network: NetworkInfo) => {
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
