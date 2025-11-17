import type { PageType } from '../App';

interface OptimizerPageProps {
  address: string;
  onNavigate: (page: PageType, address?: string) => void;
}

export const OptimizerPage = ({ address, onNavigate }: OptimizerPageProps) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🎯 Smart Chain Optimizer</h1>
      <p>Optimizing for address: {address || 'No address selected'}</p>
      <p style={{ color: 'var(--success-color)', marginBottom: '24px' }}>
        💎 Recommended: Use Asset Hub for 88.94% savings!
      </p>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={() => onNavigate('fees', address)}>
          💰 View Fee Details
        </button>
        <button onClick={() => onNavigate('dashboard', address)}>
          📊 Back to Portfolio
        </button>
      </div>
    </div>
  );
};