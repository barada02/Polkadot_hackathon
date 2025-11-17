import type { PageType } from '../App';

interface DashboardPageProps {
  address: string;
  onNavigate: (page: PageType, address?: string) => void;
}

export const DashboardPage = ({ address, onNavigate }: DashboardPageProps) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>📊 Portfolio Dashboard</h1>
      <p>Current address: {address || 'No address selected'}</p>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Coming soon: Multi-chain portfolio analysis across 6 Westend chains
      </p>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={() => onNavigate('fees', address)}>
          💰 Analyze Fees
        </button>
        <button onClick={() => onNavigate('optimizer', address)}>
          🎯 Optimize Route
        </button>
        <button onClick={() => onNavigate('network')}>
          📈 Network Health
        </button>
      </div>
    </div>
  );
};