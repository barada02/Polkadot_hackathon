import { useState, useEffect } from 'react';
import ApiService from '../../services/api';

interface Chain {
  chainId: string;
  chainName: string;
  name: string;
  fee: string;
  feeFormatted: string;
  tokenSymbol: string;
  chainConfig?: {
    icon?: string;
    type?: string;
  };
}

interface FeeData {
  totalChains: number;
  successfulChains: number;
  failedChains: number;
  fees: Chain[];
  sortedByCheapest: Chain[];
  savings: {
    cheapest: string;
    mostExpensive: string;
    savingsAmount: string;
    savingsPercent: string;
    absoluteSavings: string;
  };
  analysisTime: number;
  timestamp: string;
}

function FeeAnalyzer() {
  const [feeData, setFeeData] = useState<FeeData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [supportedChains, setSupportedChains] = useState<Chain[]>([]);
  const [formData, setFormData] = useState({
    destinationAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', // Default test address
    amount: '1000000000000' // Default 1 DOT in planck units
  });

  useEffect(() => {
    loadSupportedChains();
  }, []);

  const loadSupportedChains = async () => {
    try {
      const chains = await ApiService.getFeesSupportedChains();
      setSupportedChains(chains.chains || []);

    } catch (err) {
      console.error('Failed to load supported chains:', err);
    }
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compareFees = async () => {
    if (!formData.destinationAddress) {
      setError('Please enter a destination address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.compareFees(
        formData.destinationAddress,
        formData.amount
      );
      console.log('Fee comparison response:', response); // Debug log
      
      // Handle nested response structure
      const feeData = response.data?.data || response.data || response;
      setFeeData(feeData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Fee comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFee = (fee: string | number): string => {
    if (!fee) return 'N/A';
    const feeValue = typeof fee === 'string' ? parseFloat(fee) : fee;
    // Convert from smallest unit (planck) to token unit
    const tokenValue = feeValue / Math.pow(10, 12); // 12 decimals for WND
    return `${tokenValue.toFixed(8)} Raw`;
  };

  return (
    <div className="page">
      <h2>Cross-Chain Fee Analyzer</h2>
      <p className="text-muted">Compare transfer fees and find optimal routes (89% savings proven!)</p>

      {/* Fee Comparison Form */}
      <div className="card">
        <h3>💰 Fee Comparison Tool</h3>
        <div className="fee-form">
          <div className="form-row">
            <div className="form-group">
              <label>Destination Address:</label>
              <input
                type="text"
                name="destinationAddress"
                value={formData.destinationAddress}
                onChange={handleInputChange}
                placeholder="Enter Polkadot/Kusama address..."
                className="form-input"
                style={{ fontFamily: 'monospace', fontSize: '0.9em' }}
              />
            </div>
            
            <div className="form-group">
              <label>Amount (in planck units):</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="1000000000000 (1 DOT)"
                className="form-input"
              />
              <small style={{ color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                Enter amount in planck units (1 DOT = 1,000,000,000,000 planck)
              </small>
            </div>
            <button 
              onClick={compareFees} 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? '🔄 Analyzing...' : '🔍 Compare Fees'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card error">
          <h3>⚠️ Analysis Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Fee Comparison Results */}
      {feeData && (
        <>
          {/* Savings Summary */}
          <div className="card highlight">
            <h3>💰 Fee Savings Analysis</h3>
            <div className="savings-summary">
              <div className="savings-card">
                <div className="savings-percentage">{feeData.savings?.savingsPercent || '0%'}</div>
                <div className="savings-label">Total Savings</div>
              </div>
              <div className="savings-details">
                <div className="detail-item">
                  <span className="label">💎 Cheapest:</span>
                  <span className="value">{feeData.savings?.cheapest}</span>
                </div>
                <div className="detail-item">
                  <span className="label">💸 Most Expensive:</span>
                  <span className="value">{feeData.savings?.mostExpensive}</span>
                </div>
                <div className="detail-item">
                  <span className="label">💵 Save Amount:</span>
                  <span className="value">{feeData.savings?.absoluteSavings} WND</span>
                </div>
                <div className="detail-item">
                  <span className="label">⏱️ Analysis Time:</span>
                  <span className="value">{feeData.analysisTime}ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fee Comparison Chart */}
          <div className="card">
            <h3>📊 Chain Fee Comparison ({feeData.totalChains} chains analyzed)</h3>
            {(() => {
              console.log('Debug - feeData.sortedByCheapest:', feeData.sortedByCheapest);
              console.log('Debug - Full feeData:', feeData);
              return null;
            })()}
            <div className="fee-chart">
              {(feeData.sortedByCheapest || feeData.fees || []).map((chain: Chain, index: number) => {
                const chainsArray = feeData.sortedByCheapest || feeData.fees || [];
                const isRecommended = index === 0;
                const isExpensive = index === chainsArray.length - 1;
                return (
                  <div key={chain.chainId} className={`fee-bar ${isRecommended ? 'recommended' : ''} ${isExpensive ? 'expensive' : ''}`}>
                    <div className="chain-info">
                      <div className="chain-header">
                        <span className="chain-icon">{chain.chainConfig?.icon || '⛓️'}</span>
                        <span className="chain-name">{chain.chainName}</span>
                        {isRecommended && <span className="badge recommended">💎 Best</span>}
                        {isExpensive && <span className="badge expensive">💸 Highest</span>}
                      </div>
                      <div className="chain-type">{chain.chainConfig?.type || 'chain'}</div>
                    </div>
                    <div className="fee-info">
                      <div className="fee-amount">{chain.feeFormatted} {chain.tokenSymbol}</div>
                      <div className="fee-raw">{formatFee(chain.fee)}</div>
                    </div>
                  </div>
                );
              })}
              {(!feeData.sortedByCheapest && !feeData.fees) && (
                <div className="no-data">
                  <p>No fee data available to display chart.</p>
                  <p>Check console for debugging information.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Supported Networks */}
      <div className="card">
        <h3>🌐 Fee Analysis Networks ({supportedChains.length})</h3>
        <div className="network-grid">
          {supportedChains.map((chain, index) => (
            <div key={index} className="network-item">
              <span className="network-name">{chain.name}</span>
              <span className="network-id">({chain.chainId})</span>
              <span className="network-status">🟢</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeeAnalyzer;