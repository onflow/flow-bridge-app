'use client';

import LiFiWidgetComponent from '@/components/LiFiWidget';

export default function Home() {
  return (
    <>
      <nav className="top-nav">
        <div className="nav-content">
          <div className="logo">
            <img src="/flow-logo.svg" alt="Flow Logo" width="100px" height="32px" />
          </div>
        </div>
      </nav>
      <main>
        <LiFiWidgetComponent />
      </main>
    </>
  );
}

