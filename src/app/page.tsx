import Link from 'next/link';
import { AstralLogo } from '@/components/icons/astral-logo';

export default function WelcomePage() {
  return (
    <div className="container">
      <header className="qn-header">
        <div className="qn-logo">
          <AstralLogo className="h-8 w-8 mr-2" />
          AstralCore
        </div>
        <div className="auth-buttons">
          <Link href="/login" className="qn-btn qn-btn-outline">Login</Link>
          <Link href="/register" className="qn-btn qn-btn-primary">Register</Link>
        </div>
      </header>

      <div className="qn-dashboard">
        <div className="qn-sidebar">
          <div className="qn-user-profile">
            <div className="qn-avatar">QN</div>
            <h3>Quantum User</h3>
            <div className="qn-badge">Gold Ninja</div>
          </div>
          <ul className="qn-nav-menu">
            <li><a href="#" className="active"><i>📊</i> Dashboard</a></li>
            <li><a href="#"><i>💳</i> Wallet</a></li>
            <li><a href="#"><i>🤖</i> Bot Controls</a></li>
            <li><a href="#"><i>📈</i> Earnings</a></li>
            <li><a href="#"><i>👥</i> Team</a></li>
            <li><a href="#"><i>📜</i> Transactions</a></li>
            <li><a href="#"><i>⚙️</i> Settings</a></li>
            <li><a href="#"><i>🆘</i> Support</a></li>
          </ul>
        </div>

        <div className="qn-main-content">
          <div className="qn-wallet-card">
            <div className="qn-wallet-header">
              <div>
                <div className="qn-wallet-balance">$4,382.50</div>
                <div>Total Balance</div>
              </div>
              <div className="qn-wallet-actions">
                <button className="qn-btn qn-btn-outline">Deposit</button>
                <button className="qn-btn qn-btn-primary">Withdraw</button>
              </div>
            </div>
            <div className="qn-stats-grid">
              <div className="qn-stat-card">
                <div className="qn-stat-title">Available</div>
                <div className="qn-stat-value">$1,245.80</div>
              </div>
              <div className="qn-stat-card">
                <div className="qn-stat-title">Daily Earnings</div>
                <div className="qn-stat-value">$219.13</div>
              </div>
              <div className="qn-stat-card">
                <div className="qn-stat-title">Referral Bonus</div>
                <div className="qn-stat-value">$85.50</div>
              </div>
            </div>
          </div>

          <div className="qn-bot-controls">
            <div className="qn-bot-status">
              <div className="qn-bot-status-title">
                <div className="qn-status-indicator"></div>
                <h3>Quantum Ninja Bot</h3>
              </div>
              <p>Bot is currently running and generating earnings</p>
              <button className="qn-btn qn-btn-outline" style={{marginTop: '10px'}}>Bot Settings</button>
            </div>
            <div className="qn-bot-status">
              <div className="qn-bot-status-title">
                <div className="qn-status-indicator"></div>
                <h3>Current Plan</h3>
              </div>
              <p>Gold Ninja - 5.00% Daily Growth</p>
              <button className="qn-btn qn-btn-primary" style={{marginTop: '10px'}}>Upgrade Plan</button>
            </div>
          </div>

          <div className="qn-grid-system">
            <div className="qn-grid-header">
              <h3>Today's Grids</h3>
              <div>Next reset in: 4h 22m</div>
            </div>
            <div className="qn-grids-container">
              <div className="qn-grid-item active">
                <div className="qn-grid-time">08:00 AM</div>
                <div className="qn-grid-amount">+$43.75</div>
              </div>
              <div className="qn-grid-item active">
                <div className="qn-grid-time">11:00 AM</div>
                <div className="qn-grid-amount">+$43.75</div>
              </div>
              <div className="qn-grid-item">
                <div className="qn-grid-time">02:00 PM</div>
                <div className="qn-grid-amount">+$43.75</div>
              </div>
              <div className="qn-grid-item">
                <div className="qn-grid-time">05:00 PM</div>
                <div className="qn-grid-amount">+$43.75</div>
              </div>
              <div className="qn-grid-item">
                <div className="qn-grid-time">08:00 PM</div>
                <div className="qn-grid-amount">+$43.75</div>
              </div>
            </div>
          </div>

          <div className="qn-plans-section">
            <h3>Investment Plans</h3>
            <p>Choose a plan that matches your investment goals</p>
            <div className="qn-plans-grid">
              <div className="qn-plan-card">
                <div className="qn-plan-badge" style={{background: 'rgba(205, 127, 50, 0.1)', color: '#cd7f32'}}>🟤</div>
                <div className="qn-plan-name">Bronze Ninja</div>
                <div className="qn-plan-range">$100 - $499</div>
                <div className="qn-plan-stats">
                  <div className="qn-plan-stat">
                    <span>Daily Growth:</span>
                    <span>2.00%</span>
                  </div>
                  <div className="qn-plan-stat">
                    <span>Grids/Day:</span>
                    <span>3</span>
                  </div>
                  <div className="qn-plan-stat">
                    <span>Duration:</span>
                    <span>30 Days</span>
                  </div>
                </div>
                <button className="qn-btn qn-btn-outline" style={{width: '100%', marginTop: '15px'}}>Select Plan</button>
              </div>

              <div className="qn-plan-card">
                <div className="qn-plan-badge" style={{background: 'rgba(192, 192, 192, 0.1)', color: '#c0c0c0'}}>⚪</div>
                <div className="qn-plan-name">Silver Ninja</div>
                <div className="qn-plan-range">$500 - $999</div>
                <div className="qn-plan-stats">
                  <div className="qn-plan-stat">
                    <span>Daily Growth:</span>
                    <span>3.50%</span>
                  </div>
                  <div className="qn-plan-stat">
                    <span>Grids/Day:</span>
                    <span>4</span>
                  </div>
                  <div className="qn-plan-stat">
                    <span>Duration:</span>
                    <span>45 Days</span>
                  </div>
                </div>
                <button className="qn-btn qn-btn-outline" style={{width: '100%', marginTop: '15px'}}>Select Plan</button>
              </div>

              <div className="qn-plan-card current">
                <div className="qn-plan-badge" style={{background: 'rgba(255, 215, 0, 0.1)', color: '#ffd700'}}>🟡</div>
                <div className="qn-plan-name">Gold Ninja</div>
                <div className="qn-plan-range">$1,000 - $4,999</div>
                <div className="qn-plan-stats">
                  <div className="qn-plan-stat">
                    <span>Daily Growth:</span>
                    <span>5.00%</span>
                  </div>
                  <div className="qn-plan-stat">
                    <span>Grids/Day:</span>
                    <span>5</span>
                  </div>
                  <div className="qn-plan-stat">
                    <span>Duration:</span>
                    <span>60 Days</span>
                  </div>
                </div>
                <button className="qn-btn qn-btn-primary" style={{width: '100%', marginTop: '15px'}}>Current Plan</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
