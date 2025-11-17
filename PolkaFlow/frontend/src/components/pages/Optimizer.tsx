import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';

interface OptimizerProps {
  address: string;
}

function Optimizer({ address }: OptimizerProps) {
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [supportedChains, setSupportedChains] = useState([]);
  const [formData, setFormData] = useState({
    fromChain: '',
    toChain: '',
    amount: '10'
  });

  useEffect(() => {
    loadSupportedChains();
  }, []);

  const loadSupportedChains = async () => {
    try {
      const response = await ApiService.getFeesSupportedChains();
      console.log('Optimizer - Supported chains response:', response); // Debug log
      
      // Handle nested response structure
      const chainsData = response.data?.data || response.data || response;
      const chains = chainsData.chains || chainsData || [];
      
      console.log('Optimizer - Processed chains:', chains); // Debug log
      setSupportedChains(chains);
      
      if (chains && chains.length >= 2) {
        setFormData(prev => ({
          ...prev,
          fromChain: chains[0].chainId || chains[0].id,
          toChain: chains[chains.length - 1].chainId || chains[chains.length - 1].id
        }));
      }
    } catch (err) {
      console.error('Failed to load supported chains:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const findOptimalRoute = async () => {
    if (!formData.fromChain || !formData.toChain) {
      setError('Please select both source and destination chains');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getOptimalRoute(
        formData.fromChain,
        formData.toChain,
        parseFloat(formData.amount)
      );
      
      console.log('Optimal route response:', response); // Debug log
      
      // Handle nested response structure
      const data = response.data?.data || response.data || response;
      setRouteData(data);
    } catch (err) {
      setError(err.message);
      console.error('Route optimization error:', err);
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
      <h2>Route Optimizer</h2>
      <p className="text-muted">Find the most cost-effective cross-chain transfer routes</p>

      {/* Route Optimization Form */}
      <div className="card">
        <h3>⚡ Route Optimization</h3>
        <div className="optimizer-form">
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
                  <option key={index} value={chain.chainId || chain.id}>
                    {chain.name} ({chain.chainId || chain.id})
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
                  <option key={index} value={chain.chainId || chain.id}>
                    {chain.name} ({chain.chainId || chain.id})
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
              onClick={findOptimalRoute} 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? '🔄 Finding Route...' : '🎯 Find Optimal Route'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card error">
          <h3>⚠️ Optimization Error</h3>
          <p>{error}</p>
        </div>
      )}

      {/* Route Results */}
      {routeData && (
        <div className="results-section">
          {/* Optimal Route Card */}
          <div className="card highlight">
            <h3>🏆 Recommended Route</h3>
            <div className="route-display">
              <div className="route-path">
                {routeData.optimalRoute && (
                  <div className="path-visualization">
                    <span className="route-steps">
                      {routeData.optimalRoute.path?.join(' → ') || routeData.optimalRoute.type}
                    </span>
                    <div className="route-savings">
                      <span className="savings-badge">
                        {routeData.recommendation}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="route-details">
                <div className="detail-item">
                  <span className="label">Total Fee:</span>
                  <span className="value">{routeData.optimalRoute?.estimatedFee?.totalFeeFormatted} {routeData.optimalRoute?.estimatedFee?.tokenSymbol}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Hops:</span>
                  <span className="value">{routeData.optimalRoute?.hops}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Route Type:</span>
                  <span className="value">{routeData.optimalRoute?.routeType?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Comparison */}
          <div className="card">
            <h3>📊 Route Comparison ({routeData.totalRoutes} routes found)</h3>
            <div className="comparison-table">
              <div className="comparison-header">
                <span>Route Type</span>
                <span>Fee</span>
                <span>Hops</span>
                <span>Savings</span>
              </div>
              {routeData.allRoutes?.map((route, index) => {
                const isOptimal = route.type === routeData.optimalRoute?.type && route.hops === routeData.optimalRoute?.hops;
                const savingsPercent = index === 0 && routeData.allRoutes.length > 1 ? 
                  Math.round(((parseFloat(routeData.allRoutes[1].estimatedFee?.totalFee) - parseFloat(route.estimatedFee?.totalFee)) / parseFloat(routeData.allRoutes[1].estimatedFee?.totalFee)) * 100) : 0;
                
                return (
                  <div key={index} className={`comparison-row ${isOptimal ? 'optimal' : ''}`}>
                    <span className="route-type">
                      {isOptimal ? '⚡ Optimal' : route.type === 'direct' ? '🔗 Direct' : '🔄 Multi-hop'}
                    </span>
                    <span className="fee">{route.estimatedFee?.totalFeeFormatted} {route.estimatedFee?.tokenSymbol}</span>
                    <span className="steps">{route.hops}</span>
                    <span className="savings">{isOptimal && savingsPercent > 0 ? `${savingsPercent}%` : '-'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          {routeData.optimalRoute?.instructions && (
            <div className="card">
              <h3>📋 Step-by-Step Instructions</h3>
              <div className="instructions-list">
                {routeData.optimalRoute.instructions.map((instruction, index) => (
                  <div key={index} className="instruction-item">
                    <div className="step-number">{index + 1}</div>
                    <div className="instruction-content">
                      <div className="instruction-title">{instruction.title}</div>
                      <div className="instruction-details">{instruction.details}</div>
                      {instruction.fee && (
                        <div className="instruction-fee">Fee: {formatFee(instruction.fee)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Optimization Tips */}
      <div className="card">
        <h3>💡 Optimization Tips</h3>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">💰</span>
            <div className="tip-content">
              <div className="tip-title">Consider Transfer Amount</div>
              <div className="tip-description">Larger transfers benefit more from multi-hop routes due to fixed fees</div>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">⏱️</span>
            <div className="tip-content">
              <div className="tip-title">Time vs Cost Trade-off</div>
              <div className="tip-description">Direct routes are faster but may cost more in fees</div>
            </div>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🔄</span>
            <div className="tip-content">
              <div className="tip-title">Network Conditions</div>
              <div className="tip-description">Fees can vary based on network congestion and liquidity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Optimizer;