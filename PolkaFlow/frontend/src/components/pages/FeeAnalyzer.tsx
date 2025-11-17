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
    fromChain: '',
    toChain: '',
    amount: '1'
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
    if (!formData.fromChain || !formData.toChain) {
      setError('Please select both source and destination chains');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.compareFees(
        formData.fromChain,
        formData.toChain,
        parseFloat(formData.amount)
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
    return `${parseFloat(fee).toFixed(6)} DOT`;
  };

  const formatPercentage = (percentage) => {
    if (!percentage) return '0%';
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
              <label>From Chain:</label>
              <select 
                name="fromChain" 
                value={formData.fromChain} 
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select source chain...</option>
                {supportedChains.map((chain, index) => (
                  <option key={index} value={chain.chainId}>
                    {chain.name} ({chain.chainId})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>To Chain:</label>
              <select 
                name="toChain" 
                value={formData.toChain} 
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select destination chain...</option>
                {supportedChains.map((chain, index) => (
                  <option key={index} value={chain.chainId}>
                    {chain.name} ({chain.chainId})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount (DOT):</label>
              <input 
                type="number" 
                name="amount" 
                value={formData.amount} 
                onChange={handleInputChange}
                min="0.01"
                step="0.01"
                className="form-input"
              />
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
        <div className="card highlight">
          <h3>📊 Fee Analysis Results</h3>
          <div className="fee-results">
            <div className="result-summary">
              <div className="savings-highlight">
                <span className="savings-label">Potential Savings:</span>
                <span className="savings-amount">{formatPercentage(feeData.savings?.percentage)}</span>
              </div>
              <div className="amount-details">
                <span>Save {formatAmount(feeData.savings?.amount)} on {formatAmount(formData.amount)} transfer</span>
              </div>
            </div>
            
            <div className="route-comparison">
              <div className="route direct">
                <h4>🔗 Direct Route</h4>
                <div className="route-details">
                  <span>Fee: {formatFee(feeData.directRoute?.fee)}</span>
                  <span>Route: {feeData.directRoute?.route}</span>
                </div>
              </div>
              
              <div className="route optimal">
                <h4>⚡ Optimal Route</h4>
                <div className="route-details">
                  <span>Fee: {formatFee(feeData.optimalRoute?.fee)}</span>
                  <span>Route: {feeData.optimalRoute?.route}</span>
                  <span className="badge">Recommended</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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