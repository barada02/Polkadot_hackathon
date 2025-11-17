import type { PageType } from '../App';

interface DemoPageProps {
  onEnterApp: (address: string, startPage?: PageType) => void;
}

export const DemoPage = ({ onEnterApp }: DemoPageProps) => {
  const handleDemoAccount = (address: string) => {
    onEnterApp(address, 'dashboard');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎪 Live Demo</h1>
      <p style={{ fontSize: '1.25rem', marginBottom: '32px' }}>
        Try PolkaFlow with pre-loaded test accounts
      </p>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <h3>👩‍💼 Alice</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Multi-chain portfolio with active balances
          </p>
          <button 
            onClick={() => handleDemoAccount('5GrwvaEF5zXb26Fz9rcQpnWsgn7PGrtnYnxBVMn2efMvRgjT')}
            style={{ width: '100%' }}
          >
            Analyze Alice's Portfolio
          </button>
        </div>
        
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <h3>👨‍💻 Bob</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Heavy Westend Relay user (high fees)
          </p>
          <button 
            onClick={() => handleDemoAccount('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')}
            style={{ width: '100%' }}
          >
            Analyze Bob's Portfolio
          </button>
        </div>
        
        <div style={{
          backgroundColor: 'var(--surface)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <h3>👨‍🔬 Charlie</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Asset Hub optimizer (smart user)
          </p>
          <button 
            onClick={() => handleDemoAccount('5FLSigC9HGRKVhB9FiEo4Y3koPFNTsXN4hdKD6gsfV4bfz9C')}
            style={{ width: '100%' }}
          >
            Analyze Charlie's Portfolio
          </button>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'rgba(0, 212, 170, 0.1)',
        padding: '24px',
        borderRadius: '8px',
        marginBottom: '32px'
      }}>
        <h3 style={{ color: 'var(--success-color)' }}>🎯 Expected Results</h3>
        <p>You'll see live data showing how Asset Hub saves 88.94% compared to Westend Relay</p>
      </div>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        Use the navigation buttons above to explore the app or click "New Address" to try a different account.
      </p>
    </div>
  );
};