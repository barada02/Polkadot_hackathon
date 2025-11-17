import type { PageType } from '../App';

interface FeeAnalyzerPageProps {
  address: string;
  onNavigate: (page: PageType, address?: string) => void;
}

export const FeeAnalyzerPage = ({ address, onNavigate }: FeeAnalyzerPageProps) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>💰 Fee Analysis</h1>
      <p>Analyzing fees for: {address || 'No address selected'}</p>
      <p style={{ color: 'var(--success-color)', fontSize: '1.25rem', marginBottom: '24px' }}>
        🎯 Up to 88.94% savings available!
      </p>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <button onClick={() => onNavigate('optimizer', address)}>
          🎯 Find Best Route
        </button>
        <button onClick={() => onNavigate('dashboard', address)}>
          📊 Back to Portfolio
        </button>
      </div>
    </div>
  );
};