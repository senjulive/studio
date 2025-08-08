'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

interface QuantumNinjaLayoutProps {
  children: ReactNode;
  showAuth?: boolean;
  currentPage?: string;
}

export function QuantumNinjaLayout({ 
  children, 
  showAuth = true, 
  currentPage = 'Dashboard' 
}: QuantumNinjaLayoutProps) {
  return (
    <div className="container">
      <header className="qn-header">
        <div className="qn-logo">Quantum Ninja</div>
        {showAuth && (
          <div className="auth-buttons">
            <Link href="/login" className="qn-btn qn-btn-outline">Login</Link>
            <Link href="/register" className="qn-btn qn-btn-primary">Register</Link>
          </div>
        )}
      </header>

      <div className="qn-dashboard">
        <div className="qn-sidebar">
          <div className="qn-user-profile">
            <div className="qn-avatar">QN</div>
            <h3>Quantum User</h3>
            <div className="qn-badge">Gold Ninja</div>
          </div>
          <ul className="qn-nav-menu">
            <li>
              <Link href="/dashboard" className={currentPage === 'Dashboard' ? 'active' : ''}>
                <i>📊</i> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/wallet" className={currentPage === 'Wallet' ? 'active' : ''}>
                <i>💳</i> Wallet
              </Link>
            </li>
            <li>
              <Link href="/dashboard/trading" className={currentPage === 'Bot Controls' ? 'active' : ''}>
                <i>🤖</i> Bot Controls
              </Link>
            </li>
            <li>
              <Link href="/dashboard/rewards" className={currentPage === 'Earnings' ? 'active' : ''}>
                <i>📈</i> Earnings
              </Link>
            </li>
            <li>
              <Link href="/dashboard/squad" className={currentPage === 'Team' ? 'active' : ''}>
                <i>👥</i> Team
              </Link>
            </li>
            <li>
              <Link href="#" className={currentPage === 'Transactions' ? 'active' : ''}>
                <i>📜</i> Transactions
              </Link>
            </li>
            <li>
              <Link href="/dashboard/security" className={currentPage === 'Settings' ? 'active' : ''}>
                <i>⚙️</i> Settings
              </Link>
            </li>
            <li>
              <Link href="/dashboard/support" className={currentPage === 'Support' ? 'active' : ''}>
                <i>🆘</i> Support
              </Link>
            </li>
          </ul>
        </div>

        <div className="qn-main-content">
          {children}
        </div>
      </div>
    </div>
  );
}
