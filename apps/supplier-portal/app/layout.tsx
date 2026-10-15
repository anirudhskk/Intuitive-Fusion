import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Supplier Portal — Intuitive Fusion',
  description: 'Find, respond to and track tenders',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

/**
 * Deployed separately from the internal app, behind WAF + Shield (SEC-AP01, SEC-AP02), with its own
 * identity pool (SEC-A03) and network segment (SEC-N02).
 */
export default function SupplierLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="shell">
          <header className="topbar">
            <strong>Supplier Portal</strong>
            <nav className="nav" aria-label="Primary" style={{ border: 0, padding: 0 }}>
              <Link href="/">My tenders</Link>
              <Link href="/profile">Company profile</Link>
              <Link href="/register">Register</Link>
            </nav>
          </header>
          <main id="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
