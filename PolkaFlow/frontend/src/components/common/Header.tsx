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
    padding: '16px 24px',
    backgroundColor: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    boxShadow: '0 2px 4px var(--shadow)'
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'var(--primary-color)',
    cursor: 'pointer',
    margin: 0
  };

  const taglineStyle = {
    fontSize: '0.875rem',
    color: 'var(--success-color)',
    fontWeight: '500',
    backgroundColor: 'rgba(0, 212, 170, 0.1)',
    padding: '4px 8px',
    borderRadius: '4px',
    marginLeft: '12px'
  };

  const navStyle = {
    display: 'flex',
    gap: '8px'
  };

  const getButtonStyle = (isActive: boolean) => ({
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
    color: isActive ? 'white' : 'var(--text-secondary)',
    fontSize: '0.875rem',
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
          marginLeft: '16px',
          padding: '4px 8px',
          backgroundColor: 'rgba(230, 0, 122, 0.1)',
          borderRadius: '4px',
          fontSize: '0.75rem',
          color: 'var(--primary-color)'
        }}>
          {currentAddress ? `${currentAddress.slice(0, 8)}...${currentAddress.slice(-6)}` : 'No Address'}
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
        <button 
          style={getButtonStyle(currentPage === 'demo')}
          onClick={() => onNavigate('demo')}
        >
          🎪 Demo
        </button>
      </nav>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        <button 
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--primary-color)',
            backgroundColor: 'transparent',
            color: 'var(--primary-color)',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
          onClick={onBackToLanding}
        >
          🏠 New Address
        </button>
        <button 
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--surface)',
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            cursor: 'not-allowed'
          }}
          disabled
        >
          🔗 Connect Wallet (Soon)
        </button>
      </div>
    </header>
  );
};