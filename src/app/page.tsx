import { AstralNavigation } from '@/components/layout/astral-navigation';

export default function WelcomePage() {
  return (
    <AstralNavigation 
      showAuth={true}
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
        <h3>Trading Plans</h3>
        <p>Choose a plan that matches your investment goals</p>
        <div className="qn-plans-grid">
          <div className="qn-plan-card">
            <div className="qn-plan-badge" style={{background: 'rgba(205, 127, 50, 0.1)', color: '#cd7f32'}}>🟤</div>
            <div className="qn-plan-name">Bronze Trader</div>
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
            <div className="qn-plan-name">Silver Trader</div>
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
            <div className="qn-plan-name">Gold Trader</div>
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
    </AstralNavigation>
  );
}
