import { useEffect } from 'react';
import ReactGA from 'react-ga4';

const GA_TRACKING_ID = import.meta.env.VITE_GA4_TRACKING_ID;

// Mock GA for development
const mockGA = {
  initialize: (...args: any[]) => console.log('GA Mock initialized with:', ...args),
  event: (params: any) => console.log('GA Mock event:', params),
  set: (params: any) => console.log('GA Mock set:', params),
};

// Choose real or mock GA based on environment
const GA = GA_TRACKING_ID ? ReactGA : mockGA;

export function useGA() {
  useEffect(() => {
    GA.initialize(GA_TRACKING_ID);
  }, []);

  const sendEvent = (category: string, action: string, label?: string, value?: number) => {
    GA.event({
      category,
      action,
      label,
      value,
    });
  };

  const setUserProperty = (name: string, value: string) => {
    GA.set({ [name]: value });
  };

  // New function for page view events
  const sendPageView = (page: string) => {
    GA.event({
      category: 'Page View',
      action: 'View',
      label: page,
    });
  };

  // New function for bridge events
  const sendBridgeEvent = (eventName: string, eventData: string[]) => {
    GA.event({
      category: 'Bridge',
      action: eventName,
      label: eventData.join(' | '),
    });
  };

  return { sendEvent, setUserProperty, sendPageView, sendBridgeEvent };
}