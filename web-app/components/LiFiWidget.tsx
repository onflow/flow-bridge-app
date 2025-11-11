'use client';

import { LiFiWidget, WidgetConfig } from '@lifi/widget';

export default function LiFiWidgetComponent() {
  const widgetConfig: WidgetConfig = {
    // Using default configuration for simplicity
    // The widget will use its default theme and settings
    integrator: 'flow-bridge-app',
  };

  return (
    <div className="widget-container">
      <LiFiWidget config={widgetConfig} />
    </div>
  );
}

