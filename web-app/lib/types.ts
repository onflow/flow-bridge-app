/**
 * Types for LiFi Widget Analytics
 */

export type ChainId = number;

// ============================================================================
// LiFi Widget Event Types
// ============================================================================

export interface RouteStep {
  tool: string;
  execution?: {
    status: string;
    txHash?: string;
  };
}

export interface Route {
  id: string;
  fromChainId: number;
  toChainId: number;
  fromToken?: { address: string; symbol: string };
  toToken?: { address: string; symbol: string };
  fromAmountUSD?: string;
  toAmountUSD?: string;
  steps?: RouteStep[];
}

export interface Process {
  type?: string;
  status?: string;
  error?: { message: string };
}

export interface WalletConnectedData {
  address?: string;
  chainId?: number;
  chainType?: string;
}

export interface ChainTokenSelectedData {
  chainId: number;
  tokenAddress: string;
}

export interface RouteSelectedData {
  route: Route;
  routes: Route[];
}

export interface RouteExecutionUpdateData {
  route: Route;
  process: Process;
}

export interface RouteHighValueLossData {
  valueLoss: number;
  fromAmountUSD: number;
}

// ============================================================================
// Utilities
// ============================================================================

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  10: 'Optimism',
  56: 'BNB Chain',
  137: 'Polygon',
  250: 'Fantom',
  324: 'zkSync Era',
  747: 'Flow',
  8453: 'Base',
  42161: 'Arbitrum',
  43114: 'Avalanche',
};

export function getChainName(chainId: ChainId): string {
  return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
}

export function getAmountRangeLabel(amount: number): string {
  if (amount < 100) return 'under_100';
  if (amount < 1000) return '100_to_1000';
  if (amount < 10000) return '1000_to_10000';
  return 'over_10000';
}
