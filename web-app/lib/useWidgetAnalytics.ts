'use client';

/**
 * LiFi Widget Analytics Hook
 * 
 * This hook tracks user interactions with the LiFi bridge widget and sends
 * them to Google Analytics 4. These events help measure user engagement
 * and conversion rates for marketing campaigns.
 * 
 * ============================================================================
 * EVENTS TRACKED
 * ============================================================================
 * 
 * widget_loaded
 *   - Fires when the bridge widget mounts on the page
 *   - Useful for measuring page reach and widget load success rate
 * 
 * wallet_connected
 *   - Fires when a user connects their crypto wallet
 *   - Key engagement metric - shows user intent to transact
 *   - Params: chain_id, chain_type, has_address (boolean for privacy)
 * 
 * source_selected
 *   - Fires when user selects the source chain/token (where funds come FROM)
 *   - Helps understand which chains users are bridging from
 *   - Params: chain_id, chain_name
 * 
 * destination_selected
 *   - Fires when user selects destination chain/token (where funds go TO)
 *   - Critical for measuring Flow adoption as a destination chain
 *   - Params: chain_id, chain_name
 * 
 * route_selected
 *   - Fires when user picks a specific bridge route from available options
 *   - Shows which bridge providers (tools) users prefer
 *   - Params: from_chain, to_chain, tool
 * 
 * bridge_started
 *   - Fires when user initiates the bridge transaction
 *   - PRIMARY CONVERSION EVENT - user has committed to bridging
 *   - Params: from_chain, to_chain, tool
 * 
 * bridge_completed
 *   - Fires when the bridge transaction succeeds
 *   - Measures successful conversions and completion rate
 *   - Params: from_chain, to_chain, tool, tx_hash
 * 
 * bridge_failed
 *   - Fires when a bridge transaction fails
 *   - Helps identify issues and improve user experience
 *   - Params: from_chain, to_chain, error (truncated to 100 chars)
 * 
 * high_value_loss_warning
 *   - Fires when user sees a warning about significant value loss in the route
 *   - Monitors how often users encounter unfavorable rates
 *   - Params: value_loss_percent, amount_range
 * 
 * ============================================================================
 * USAGE
 * ============================================================================
 * 
 * Simply call this hook in your widget component:
 * 
 * ```tsx
 * import { useWidgetAnalytics } from '@/lib/useWidgetAnalytics';
 * 
 * function MyWidget() {
 *   useWidgetAnalytics();
 *   return <LiFiWidget ... />;
 * }
 * ```
 * 
 * To disable analytics, comment out the hook call.
 * 
 * ============================================================================
 * GA4 SETUP
 * ============================================================================
 * 
 * In Google Analytics, mark these as conversion events:
 *   1. bridge_started  - Primary conversion
 *   2. bridge_completed - Success tracking
 *   3. wallet_connected - Engagement goal
 * 
 */

import { useWidgetEvents, WidgetEvent } from '@lifi/widget';
import { useEffect, useRef, useCallback } from 'react';
import { trackEvent } from './analytics';
import { getChainName, getAmountRangeLabel } from './types';
import type {
  Route,
  RouteStep,
  WalletConnectedData,
  ChainTokenSelectedData,
  RouteSelectedData,
  RouteExecutionUpdateData,
  RouteHighValueLossData,
} from './types';

export function useWidgetAnalytics() {
  const widgetEvents = useWidgetEvents();
  const initialized = useRef(false);
  const listenersRegistered = useRef(false);

  // Memoize event handlers to prevent recreation on each render
  const onWalletConnected = useCallback((data: WalletConnectedData) => {
    trackEvent('wallet_connected', {
      chain_id: data.chainId,
      chain_type: data.chainType,
      has_address: !!data.address,
    });
  }, []);

  const onSourceSelected = useCallback((data: ChainTokenSelectedData) => {
    trackEvent('source_selected', {
      chain_id: data.chainId,
      chain_name: getChainName(data.chainId),
    });
  }, []);

  const onDestinationSelected = useCallback((data: ChainTokenSelectedData) => {
    trackEvent('destination_selected', {
      chain_id: data.chainId,
      chain_name: getChainName(data.chainId),
    });
  }, []);

  const onRouteSelected = useCallback((data: RouteSelectedData) => {
    const r = data.route;
    trackEvent('route_selected', {
      from_chain: getChainName(r.fromChainId),
      to_chain: getChainName(r.toChainId),
      tool: r.steps?.[0]?.tool,
    });
  }, []);

  const onBridgeStarted = useCallback((route: Route) => {
    trackEvent('bridge_started', {
      from_chain: getChainName(route.fromChainId),
      to_chain: getChainName(route.toChainId),
      tool: route.steps?.[0]?.tool,
    });
  }, []);

  const onBridgeCompleted = useCallback((route: Route) => {
    trackEvent('bridge_completed', {
      from_chain: getChainName(route.fromChainId),
      to_chain: getChainName(route.toChainId),
      tool: route.steps?.[0]?.tool,
      tx_hash: route.steps?.find((s: RouteStep) => s.execution?.status === 'DONE')?.execution?.txHash,
    });
  }, []);

  const onBridgeFailed = useCallback((data: RouteExecutionUpdateData) => {
    trackEvent('bridge_failed', {
      from_chain: getChainName(data.route.fromChainId),
      to_chain: getChainName(data.route.toChainId),
      error: data.process?.error?.message?.substring(0, 100),
    });
  }, []);

  const onHighValueLoss = useCallback((data: RouteHighValueLossData) => {
    trackEvent('high_value_loss_warning', {
      value_loss_percent: data.valueLoss,
      amount_range: getAmountRangeLabel(data.fromAmountUSD),
    });
  }, []);

  useEffect(() => {
    // Prevent duplicate widget_loaded events on re-renders
    if (!initialized.current) {
      trackEvent('widget_loaded', { widget_type: 'lifi_bridge' });
      initialized.current = true;
    }

    // Guard against re-registering if widgetEvents reference changes but is functionally the same
    if (listenersRegistered.current) {
      return;
    }
    listenersRegistered.current = true;

    // Register listeners
    widgetEvents.on(WidgetEvent.SourceChainTokenSelected, onSourceSelected);
    widgetEvents.on(WidgetEvent.DestinationChainTokenSelected, onDestinationSelected);
    widgetEvents.on(WidgetEvent.RouteSelected, onRouteSelected);
    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onBridgeStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionCompleted, onBridgeCompleted);
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onBridgeFailed);
    widgetEvents.on(WidgetEvent.RouteHighValueLoss, onHighValueLoss);
    widgetEvents.on('walletConnected', onWalletConnected);

    return () => {
      listenersRegistered.current = false;
      widgetEvents.off(WidgetEvent.SourceChainTokenSelected, onSourceSelected);
      widgetEvents.off(WidgetEvent.DestinationChainTokenSelected, onDestinationSelected);
      widgetEvents.off(WidgetEvent.RouteSelected, onRouteSelected);
      widgetEvents.off(WidgetEvent.RouteExecutionStarted, onBridgeStarted);
      widgetEvents.off(WidgetEvent.RouteExecutionCompleted, onBridgeCompleted);
      widgetEvents.off(WidgetEvent.RouteExecutionFailed, onBridgeFailed);
      widgetEvents.off(WidgetEvent.RouteHighValueLoss, onHighValueLoss);
      widgetEvents.off('walletConnected', onWalletConnected);
    };
  }, [widgetEvents, onWalletConnected, onSourceSelected, onDestinationSelected, onRouteSelected, onBridgeStarted, onBridgeCompleted, onBridgeFailed, onHighValueLoss]);
}

