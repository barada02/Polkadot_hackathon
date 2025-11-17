import { useState, useEffect } from 'react';
import ApiService from '../../services/api';

interface Chain {
  chainId: string;
  chainName: string;
  success: boolean;
  portfolio?: {
    formatted?: {
      totalBalance?: string;
      freeBalance?: string;
      reservedBalance?: string;
      tokenSymbol?: string;
    };
  };
}

interface Portfolio {
  summary?: {
    address: string;
    totalBalanceFormatted: string;
    totalChains: number;
    successfulChains: number;
    failedChains: number;
    analysisTime: number;
    timestamp: string;
  };
  chains?: Chain[];
}

interface DashboardProps {
  address: string;
}

function Dashboard({ address }: DashboardProps) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolioData();
  }, [address]);

  const loadPortfolioData = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.analyzePortfolio(address);
      console.log('Portfolio API Response:', response); // Debug log
      
      // Handle nested response structure: response.data.data
      const portfolioData = response.data?.data || response.data || response;
      console.log('Portfolio Data:', portfolioData); // Debug log
      
      setPortfolio(portfolioData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Portfolio loading error:', err);
    } finally {
      setLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="page">
        <h2>Multi-Chain Portfolio Dashboard</h2>
        <div className="card">
          <div className="loading">🔄 Analyzing portfolio across all supported chains...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Multi-Chain Portfolio Dashboard</h2>
        <div className="card error">
          <h3>⚠️ Analysis Failed</h3>
          <p>{error}</p>
          <button className="btn-secondary" onClick={loadPortfolioData}>
            🔄 Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Multi-Chain Portfolio Dashboard</h2>
      <p className="text-muted">Address: {address}</p>
      
      {portfolio && (
        <div className="dashboard-grid">
          {/* Portfolio Summary */}
          <div className="card highlight">
            <h3>📊 Portfolio Summary</h3>
            <div className="summary-stats">
              <div className="stat">
                <span className="label">Total Balance:</span>
                <span className="value">{portfolio.summary?.totalBalanceFormatted || '0'} WND</span>
              </div>
              <div className="stat">
                <span className="label">Active Chains:</span>
                <span className="value">{portfolio.summary?.totalChains || 0}</span>
              </div>
              <div className="stat">
                <span className="label">Successful Chains:</span>
                <span className="value">{portfolio.summary?.successfulChains || 0}</span>
              </div>
              <div className="stat">
                <span className="label">Analysis Time:</span>
                <span className="value">{portfolio.summary?.analysisTime || 0}ms</span>
              </div>
            </div>
          </div>

          {/* Chain Balances */}
          <div className="card">
            <h3>🔗 Chain Balances</h3>
            <div className="chain-list">
              {portfolio.chains && portfolio.chains.length > 0 ? (
                portfolio.chains.map((chain: Chain, index: number) => (
                  <div key={index} className="chain-item">
                    <div className="chain-header">
                      <span className="chain-name">{chain.chainName || chain.chainId}</span>
                      <span className={`status ${chain.success ? 'active' : 'error'}`}>
                        {chain.success ? '🟢' : '🔴'}
                      </span>
                    </div>
                    <div className="balance-info">
                      <span className="balance">
                        {chain.portfolio?.formatted?.totalBalance || '0.0000'} {chain.portfolio?.formatted?.tokenSymbol || 'WND'}
                      </span>
                      <div className="balance-breakdown">
                        <small>Free: {chain.portfolio?.formatted?.freeBalance || '0.0000'} | Reserved: {chain.portfolio?.formatted?.reservedBalance || '0.0000'}</small>
                      </div>
                    </div>
                    {!chain.success && <div className="error-msg">⚠️ Analysis failed</div>}
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <p>No chain data available</p>
                  <button className="btn-secondary" onClick={loadPortfolioData}>
                    🔄 Refresh Data
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Analysis Metadata */}
          {portfolio.summary && (
            <div className="card">
              <h3>📈 Analysis Details</h3>
              <div className="metadata">
                <div className="meta-item">
                  <span>Address:</span>
                  <span className="address-display">{portfolio.summary.address}</span>
                </div>
                <div className="meta-item">
                  <span>Analysis Time:</span>
                  <span>{new Date(portfolio.summary.timestamp).toLocaleString()}</span>
                </div>
                <div className="meta-item">
                  <span>Processing Time:</span>
                  <span>{portfolio.summary.analysisTime}ms</span>
                </div>
                <div className="meta-item">
                  <span>Failed Chains:</span>
                  <span>{portfolio.summary.failedChains}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;