import { useState } from 'react';
import type { PageType } from '../App';

interface LandingPageProps {
  onEnterApp: (address: string, startPage?: PageType) => void;
}

export const LandingPage = ({ onEnterApp }: LandingPageProps) => {
  const [addressInput, setAddressInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  
  const handleAddressSubmit = async () => {
    if (!addressInput.trim()) return;
    
    setIsValidating(true);
    // Basic Polkadot address validation (starts with 5 and reasonable length)
    if (addressInput.startsWith('5') && addressInput.length >= 47) {
      onEnterApp(addressInput.trim(), 'dashboard');
    } else {
      alert('Please enter a valid Polkadot address (starts with 5)');
    }
    setIsValidating(false);
  };
  
  const handleDemoAccount = (address: string) => {
    onEnterApp(address, 'dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '600',
            marginBottom: '8px',
            color: 'var(--primary-color)',
            letterSpacing: '-0.025em'
          }}>
            PolkaFlow
          </h1>
          
          <p style={{ 
            fontSize: '1rem', 
            color: 'var(--text-secondary)',
            marginBottom: '12px'
          }}>
            Intelligent Multi-Chain Polkadot Gateway
          </p>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            color: 'var(--success-color)',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            🎯 Save up to 88.94% on fees
          </div>
        </div>

        {/* Address Input Card */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text)',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Enter Polkadot Address
          </h3>
          
          <div style={{ marginBottom: '16px' }}>
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="5GrwvaEF5zXb26Fz9rcQpnWsgn7PGrtnYnxBVMn2efMv..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '0.875rem',
                backgroundColor: 'var(--background)',
                color: 'var(--text)',
                fontFamily: 'monospace'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddressSubmit()}
            />
          </div>
          
          <button 
            onClick={handleAddressSubmit}
            disabled={!addressInput.trim() || isValidating}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: addressInput.trim() ? 'var(--primary-color)' : 'var(--text-muted)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: addressInput.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            {isValidating ? 'Validating...' : 'Analyze Portfolio'}
          </button>
        </div>

        {/* Divider */}
        <div style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          margin: '24px 0',
          fontSize: '0.875rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: '1px',
            backgroundColor: 'var(--border-light)'
          }}></div>
          <span style={{
            backgroundColor: 'var(--background)',
            padding: '0 16px'
          }}>
            OR TRY DEMO
          </span>
        </div>

        {/* Demo Accounts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px'
        }}>
          <button 
            className="card card-compact"
            onClick={() => handleDemoAccount('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY')}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '16px 12px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>👩‍💼</div>
            <div style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text)' }}>Alice</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Multi-chain</div>
          </button>
          
          <button 
            className="card card-compact"
            onClick={() => handleDemoAccount('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty')}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '16px 12px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>👨‍💻</div>
            <div style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text)' }}>Bob</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High fees</div>
          </button>
          
          <button 
            className="card card-compact"
            onClick={() => handleDemoAccount('5FLSigC9HGRKVhB9FiEo4Y3koPFNTsXN4hdKD6gsfV4bfz9C')}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border-light)',
              borderRadius: '8px',
              padding: '16px 12px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>👨‍🔬</div>
            <div style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--text)' }}>Charlie</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Optimized</div>
          </button>
        </div>

        {/* Status */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '32px',
          padding: '12px',
          backgroundColor: 'var(--surface)',
          borderRadius: '6px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          ✅ 15 APIs Ready • 🔗 6 Chains Connected • ⚡ 5-7s Response
        </div>
      </div>
    </div>
  );
};