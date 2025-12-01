'use client';

import { GoogleAnalytics as GA } from '@next/third-parties/google';

/**
 * Google Analytics 4 Component
 * 
 * This component initializes GA4 tracking for the application.
 * It automatically tracks page views and enables custom event tracking.
 * 
 * Required Environment Variable:
 * - NEXT_PUBLIC_GA_MEASUREMENT_ID: Your GA4 Measurement ID (e.g., G-XXXXXXXXXX)
 * 
 * To get your Measurement ID:
 * 1. Go to https://analytics.google.com
 * 2. Admin → Data Streams → Select your web stream
 * 3. Copy the Measurement ID (starts with "G-")
 */
export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Don't render if no measurement ID is configured
  if (!measurementId) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[GoogleAnalytics] Missing NEXT_PUBLIC_GA_MEASUREMENT_ID environment variable. ' +
        'Analytics tracking is disabled.'
      );
    }
    return null;
  }

  return <GA gaId={measurementId} />;
}

export default GoogleAnalytics;

