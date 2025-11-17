const API_BASE_URL = 'http://localhost:3001/api/v1';

// API service for PolkaFlow backend integration
class ApiService {
  // Portfolio Analysis APIs
  static async analyzePortfolio(address) {
    const response = await fetch(`${API_BASE_URL}/portfolio/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    if (!response.ok) throw new Error(`Portfolio analysis failed: ${response.statusText}`);
    return response.json();
  }

  static async validateAddress(address) {
    const response = await fetch(`${API_BASE_URL}/portfolio/validate-address`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    });
    if (!response.ok) throw new Error(`Address validation failed: ${response.statusText}`);
    return response.json();
  }

  static async getSupportedChains() {
    const response = await fetch(`${API_BASE_URL}/portfolio/supported-chains`);
    if (!response.ok) throw new Error(`Failed to fetch supported chains: ${response.statusText}`);
    return response.json();
  }

  static async getTestAddresses() {
    const response = await fetch(`${API_BASE_URL}/portfolio/test-addresses`);
    if (!response.ok) throw new Error(`Failed to fetch test addresses: ${response.statusText}`);
    return response.json();
  }

  // Fee Analysis APIs
  static async compareFees(destinationAddress, amount) {
    const response = await fetch(`${API_BASE_URL}/fees/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destinationAddress, amount })
    });
    if (!response.ok) throw new Error(`Fee comparison failed: ${response.statusText}`);
    return response.json();
  }

  static async getOptimalRoute(fromChain, toChain, amount) {
    const response = await fetch(`${API_BASE_URL}/fees/optimal-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromChain, toChain, amount })
    });
    if (!response.ok) throw new Error(`Route optimization failed: ${response.statusText}`);
    return response.json();
  }

  static async getTestScenario() {
    const response = await fetch(`${API_BASE_URL}/fees/test-scenario`);
    if (!response.ok) throw new Error(`Failed to fetch test scenario: ${response.statusText}`);
    return response.json();
  }

  static async getFeesSupportedChains() {
    const response = await fetch(`${API_BASE_URL}/fees/supported-chains`);
    if (!response.ok) throw new Error(`Failed to fetch fee-supported chains: ${response.statusText}`);
    return response.json();
  }

  // Health Check
  static async healthCheck() {
    const response = await fetch('http://localhost:3001/health');
    if (!response.ok) throw new Error(`Health check failed: ${response.statusText}`);
    return response.json();
  }
}

export default ApiService;