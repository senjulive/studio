import { AstralNavigation } from '@/components/layout/astral-navigation';

export default function DashboardPage() {
  return (
    <AstralNavigation 
      showAuth={false}
      userProfile={{
        name: 'AstralCore User',
        tier: 'Gold Trader',
        avatar: 'AC'
      }}
    >
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
            <h3>AstralCore Bot</h3>
          </div>
          <p>Bot is currently running and generating earnings</p>
          <button className="qn-btn qn-btn-outline" style={{marginTop: '10px'}}>Bot Settings</button>
        </div>
        <div className="qn-bot-status">
          <div className="qn-bot-status-title">
            <div className="qn-status-indicator"></div>
            <h3>Current Plan</h3>
          </div>
          <p>Gold Trader - 5.00% Daily Growth</p>
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
        <h3>Performance Overview</h3>
        <p>Track your AstralCore bot performance</p>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px'}}>
          <div className="qn-stat-card">
            <div className="qn-stat-title">Total Profit</div>
            <div className="qn-stat-value" style={{color: 'var(--qn-success)'}}>+$2,158.73</div>
          </div>
          <div className="qn-stat-card">
            <div className="qn-stat-title">Success Rate</div>
            <div className="qn-stat-value">94.2%</div>
          </div>
          <div className="qn-stat-card">
            <div className="qn-stat-title">Active Grids</div>
            <div className="qn-stat-value">12</div>
          </div>
          <div className="qn-stat-card">
            <div className="qn-stat-title">Completed Trades</div>
            <div className="qn-stat-value">847</div>
          </div>
        </div>
      </div>
    </AstralNavigation>
  );
}
