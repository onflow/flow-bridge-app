'use client';

import dynamic from 'next/dynamic';

// Import LiFiWidget with SSR disabled to avoid getServerSnapshot warning
const LiFiWidgetComponent = dynamic(() => import('@/components/LiFiWidget'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '600px',
      color: '#00EF8B'
    }}>
      Loading widget...
    </div>
  ),
});

export default function Home() {
  return (
    <>
      <nav className="top-nav">
        <div className="nav-content">
          <div className="logo">
            <picture>
              <source srcSet="/flow-logo-dark.svg" media="(prefers-color-scheme: dark)" />
              <img src="/flow-logo.svg" alt="Flow Logo" width="100" height="42" />
            </picture>
          </div>
        </div>
      </nav>
      <main>
        <div id="lifi-widget-wrapper">
          <LiFiWidgetComponent />
        </div>
      </main>
    </>
  );
}

