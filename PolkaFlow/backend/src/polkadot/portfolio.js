// Portfolio Analysis Logic - Based on ex2-balances experiment
import { createClient } from "polkadot-api";
import { getSmProvider } from "polkadot-api/sm-provider";
import { chainSpec } from "polkadot-api/chains/westend2";
import { start } from "polkadot-api/smoldot";
// Import the generated descriptors (like ex2)
import pkg from "../../.papi/descriptors/dist/index.js";
const { westend2 } = pkg;

/**
 * Portfolio analysis across Westend2 ecosystem
 * Isolated Polkadot logic - no Express dependencies
 */
export class PolkadotPortfolio {
  constructor() {
    this.connections = new Map();
    this.smoldot = null;
  }

  /**
   * Initialize Smoldot if needed
   */
  async initializeSmoldot() {
    if (!this.smoldot) {
      console.log('🔧 Initializing Smoldot for portfolio analysis...');
      this.smoldot = start();
    }
    return this.smoldot;
  }

  /**
   * Analyze address portfolio on Westend2 Relay Chain
   * Based on ex4 account information patterns
   */
  async analyzeWestendPortfolio(address) {
    const startTime = Date.now();
    
    try {
      console.log(`📊 Analyzing portfolio for: ${address.slice(0, 8)}...`);
      
      // Initialize connection
      const smoldot = await this.initializeSmoldot();
      const provider = getSmProvider(smoldot.addChain({ chainSpec }));
      const client = createClient(provider);
      
      // Get typed API using generated descriptors (like ex2)
      const api = client.getTypedApi(westend2);
      
      // Get account information (like ex2)
      const accountInfo = await Promise.race([
        api.query.System.Account.getValue(address),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Account query timeout')), 15000)
        )
      ]);
      
      // Get chain info for context
      const chainInfo = await client.getChainSpecData();
      
      const analysisTime = Date.now() - startTime;
      
      // Process account data (like ex4 patterns)
      const portfolio = this.processAccountInfo(accountInfo, chainInfo);
      
      console.log(`✅ Portfolio analyzed in ${analysisTime}ms`);
      console.log(`💰 Free balance: ${portfolio.freeBalance} ${chainInfo.properties.tokenSymbol}`);
      
      return {
        success: true,
        address,
        chainId: 'westend2',
        chainName: chainInfo.name,
        portfolio,
        analysisTime,
        timestamp: new Date()
      };
      
    } catch (error) {
      const analysisTime = Date.now() - startTime;
      
      console.log(`❌ Portfolio analysis failed for ${address.slice(0, 8)}:`, error.message);
      
      return {
        success: false,
        address,
        chainId: 'westend2',
        error: error.message,
        analysisTime,
        timestamp: new Date()
      };
    }
  }

  /**
   * Process account info into portfolio format
   * Based on the patterns we used in ex2-balances
   */
  processAccountInfo(accountInfo, chainInfo) {
    if (!accountInfo) {
      return {
        exists: false,
        freeBalance: '0',
        reservedBalance: '0',
        totalBalance: '0',
        nonce: 0
      };
    }

    // Handle the account data structure (exactly like ex2)
    const freeBalance = accountInfo.data.free.toString();
    const reservedBalance = accountInfo.data.reserved.toString();
    const nonce = accountInfo.nonce;
    
    // Calculate totals (like ex2)
    const totalBalance = (accountInfo.data.free + accountInfo.data.reserved).toString();
    
    // Format for display (convert from planck to WND)
    const decimals = chainInfo.properties?.tokenDecimals || 12;
    const tokenSymbol = chainInfo.properties?.tokenSymbol || 'WND';
    
    return {
      exists: true,
      freeBalance,
      reservedBalance,
      totalBalance,
      nonce,
      // Formatted versions for UI
      formatted: {
        freeBalance: this.formatBalance(freeBalance, decimals),
        reservedBalance: this.formatBalance(reservedBalance, decimals),
        totalBalance: this.formatBalance(totalBalance, decimals),
        tokenSymbol
      }
    };
  }

  /**
   * Format balance from planck to readable format
   * Based on ex4 formatting patterns
   */
  formatBalance(balance, decimals) {
    const balanceBigInt = BigInt(balance);
    const divisor = BigInt(10 ** decimals);
    
    const wholePart = balanceBigInt / divisor;
    const fractionalPart = balanceBigInt % divisor;
    
    // Show up to 4 decimal places for readability
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.slice(0, 4).replace(/0+$/, '');
    
    if (trimmedFractional) {
      return `${wholePart}.${trimmedFractional}`;
    }
    
    return wholePart.toString();
  }

  /**
   * Validate Polkadot address format
   * Basic validation before making blockchain calls
   */
  validateAddress(address) {
    // Basic checks
    if (!address || typeof address !== 'string') {
      return { valid: false, error: 'Address is required and must be a string' };
    }
    
    // Check length (SS58 addresses are typically 47-48 characters)
    if (address.length < 40 || address.length > 60) {
      return { valid: false, error: 'Invalid address length' };
    }
    
    // Check if starts with 5 (typical for Westend SS58 format 42)
    if (!address.startsWith('5')) {
      return { valid: false, error: 'Address must start with 5 for Westend format' };
    }
    
    return { valid: true };
  }

  /**
   * Get existing connection or null
   */
  getConnection(chainId) {
    return this.connections.get(chainId) || null;
  }

  /**
   * Cleanup connections
   */
  async cleanup() {
    console.log('🧹 Cleaning up portfolio connections...');
    
    for (const [chainId, connection] of this.connections) {
      try {
        if (connection.provider && connection.provider.disconnect) {
          await connection.provider.disconnect();
        }
      } catch (error) {
        console.log(`⚠️ Error closing ${chainId}:`, error.message);
      }
    }
    
    this.connections.clear();
    
    if (this.smoldot) {
      this.smoldot.terminate();
      this.smoldot = null;
    }
  }
}

// Singleton instance
export const polkadotPortfolio = new PolkadotPortfolio();