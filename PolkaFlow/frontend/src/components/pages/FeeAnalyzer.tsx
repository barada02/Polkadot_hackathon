import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';

interface FeeAnalyzerProps {
  address: string;
}

function FeeAnalyzer({ address }: FeeAnalyzerProps) {
  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supportedChains, setSupportedChains] = useState([]);
  const [testScenario, setTestScenario] = useState(null);
  const [formData, setFormData] = useState({
    destinationAddress: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY', // Default test address
    amount: '1000000000000' // Default 1 DOT in planck units
  });

  useEffect(() => {
    loadSupportedChains();
    loadTestScenario();
  }, []);

  const loadSupportedChains = async () => {
    try {
      const chains = await ApiService.getFeesSupportedChains();
      setSupportedChains(chains.chains || []);
      // Auto-select first two chains if available
      if (chains.chains && chains.chains.length >= 2) {
        setFormData(prev => ({
          ...prev,
          fromChain: chains.chains[0].chainId,
          toChain: chains.chains[1].chainId
        }));
      }
    } catch (err) {
      console.error('Failed to load supported chains:', err);
    }
  };

  const loadTestScenario = async () => {
    try {
      const response = await ApiService.getTestScenario();
      console.log('Test scenario response:', response); // Debug log
      
      // Handle nested response structure
      const scenario = response.data?.data || response.data || response;
      setTestScenario(scenario);
    } catch (err) {
      console.error('Failed to load test scenario:', err);
    }
  };

  const handleInputChange = (e) => {
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
      setError(err.message);
      console.error('Fee comparison error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatFee = (fee) => {
    if (!fee) return 'N/A';
    const feeValue = typeof fee === 'string' ? parseFloat(fee) : fee;
    // Convert from smallest unit (planck) to token unit
    const tokenValue = feeValue / Math.pow(10, 12); // 12 decimals for WND
    return `${tokenValue.toFixed(8)} Raw`;
  };

  const formatPercentage = (percentage) => {
    if (!percentage) return '0%';
    if (typeof percentage === 'string') {
      return percentage; // Already formatted like "88.94%"
    }
    return `${percentage.toFixed(2)}%`;
  };

  const formatAmount = (amount, symbol = 'DOT') => {
    if (!amount) return '0';
    return `${parseFloat(amount).toFixed(4)} ${symbol}`;
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
            <div className="fee-chart">
              {feeData.sortedByCheapest?.map((chain, index) => {
                const isRecommended = index === 0;
                const isExpensive = index === feeData.sortedByCheapest.length - 1;
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
            </div>
          </div>
        </>
      )}

      {/* Test Scenario Display */}
      {testScenario && (
        <div className="card">
          <h3>🎯 Demo Scenario (Live Data)</h3>
          <div className="demo-scenario">
            <div className="scenario-header">
              <span>Transfer: {formatAmount(testScenario.amount)} from {testScenario.fromChain} to {testScenario.toChain}</span>
            </div>
            <div className="scenario-results">
              <div className="scenario-stat">
                <span className="label">Direct Fee:</span>
                <span className="value">{formatFee(testScenario.directFee)}</span>
              </div>
              <div className="scenario-stat">
                <span className="label">Optimal Fee:</span>
                <span className="value">{formatFee(testScenario.optimalFee)}</span>
              </div>
              <div className="scenario-stat highlight">
                <span className="label">Savings:</span>
                <span className="value">{formatPercentage(testScenario.savingsPercentage)}</span>
              </div>
            </div>
            <p className="scenario-description">{testScenario.description}</p>
          </div>
        </div>
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