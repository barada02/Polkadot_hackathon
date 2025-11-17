import type { PageType } from '../App';

interface NetworkMonitorPageProps {
  onNavigate: (page: PageType) => void;
}

export const NetworkMonitorPage = ({ onNavigate }: NetworkMonitorPageProps) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>📈 Network Health Monitor</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Real-time monitoring of 6 Westend chains
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ padding: '16px', backgroundColor: 'var(--surface)', borderRadius: '8px' }}>
          <h4>🔗 Westend Relay</h4>
          <p style={{ color: 'var(--success-color)' }}>🟢 90% Health</p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--surface)', borderRadius: '8px' }}>
          <h4>💎 Asset Hub</h4>
          <p style={{ color: 'var(--warning-color)' }}>🟠 65% Health</p>
        </div>
        <div style={{ padding: '16px', backgroundColor: 'var(--surface)', borderRadius: '8px' }}>
          <h4>🌉 Bridge Hub</h4>
          <p style={{ color: 'var(--warning-color)' }}>🟠 50% Health</p>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={() => onNavigate('dashboard')}>
          📊 Portfolio Analysis
        </button>
        <button onClick={() => onNavigate('fees')}>
          💰 Fee Comparison
        </button>
      </div>
    </div>
  );
};