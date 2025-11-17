import type { PageType } from '../../App';

interface HeaderProps {
  currentPage: PageType;
  currentAddress: string;
  onNavigate: (page: PageType) => void;
  onBackToLanding: () => void;
}

export const Header = ({ currentPage, currentAddress, onNavigate, onBackToLanding }: HeaderProps) => {
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: 'var(--background)',
    borderBottom: '1px solid var(--border-light)',
    boxShadow: '0 1px 3px var(--shadow)'
  };

  const logoStyle = {
    fontSize: '1.375rem',
    fontWeight: '600',
    color: 'var(--primary-color)',
    cursor: 'pointer',
    margin: 0,
    letterSpacing: '-0.025em'
  };

  const taglineStyle = {
    fontSize: '0.75rem',
    color: 'var(--success-color)',
    fontWeight: '500',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    marginLeft: '8px'
  };

  const navStyle = {
    display: 'flex',
    gap: '4px'
  };

  const getButtonStyle = (isActive: boolean) => ({
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
    color: isActive ? 'white' : 'var(--text-secondary)',
    fontSize: '0.8125rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap' as const
  });

  return (
    <header style={headerStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h1 
          style={logoStyle}
          onClick={onBackToLanding}
        >
          PolkaFlow
        </h1>
        <span style={taglineStyle}>Save 88.94% on fees</span>
        <div style={{
          marginLeft: '12px',
          padding: '4px 8px',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border-light)',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
          fontFamily: 'monospace'
        }}>
          {currentAddress ? `${currentAddress.slice(0, 6)}...${currentAddress.slice(-4)}` : 'No Address'}
        </div>
      </div>
      
      <nav style={navStyle}>
        <button 
          style={getButtonStyle(currentPage === 'dashboard')}
          onClick={() => onNavigate('dashboard')}
        >
          📊 Portfolio
        </button>
        <button 
          style={getButtonStyle(currentPage === 'fees')}
          onClick={() => onNavigate('fees')}
        >
          💰 Fee Analysis
        </button>
        <button 
          style={getButtonStyle(currentPage === 'optimizer')}
          onClick={() => onNavigate('optimizer')}
        >
          🎯 Optimizer
        </button>
        <button 
          style={getButtonStyle(currentPage === 'network')}
          onClick={() => onNavigate('network')}
        >
          📈 Network
        </button>
      </nav>
      
      <div style={{ display: 'flex', gap: '6px' }}>
        <button 
          className="btn-outline"
          style={{
            padding: '6px 12px',
            fontSize: '0.8125rem',
            border: '1px solid var(--border)',
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)'
          }}
          onClick={onBackToLanding}
        >
          New Address
        </button>
        <button 
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid var(--border-light)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            cursor: 'not-allowed'
          }}
          disabled
        >
          Connect Wallet
        </button>
      </div>
    </header>
  );
};