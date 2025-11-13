'use client';

import LiFiWidgetComponent from '@/components/LiFiWidget';

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
        <LiFiWidgetComponent />
      </main>
    </>
  );
}

