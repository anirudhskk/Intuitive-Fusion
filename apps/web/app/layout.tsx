import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Intuitive Fusion',
  description: 'Conversational procurement & contract management',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/intake', label: 'New request' },
  { href: '/procurements', label: 'Procurements' },
  { href: '/approvals', label: 'Approvals' },
  { href: '/contracts', label: 'Contracts' },
  { href: '/reports', label: 'Reports' },
  { href: '/admin', label: 'Admin' },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <div className="shell">
          <header className="topbar">
            <strong>Intuitive Fusion</strong>
            <span className="muted">{/* TODO tenant + user menu (SSO) */}</span>
          </header>
          <nav className="nav" aria-label="Primary">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href}>{n.label}</Link>
            ))}
          </nav>
          <main id="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
