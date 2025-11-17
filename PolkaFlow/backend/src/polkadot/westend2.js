// Westend2 Relay Chain Logic - Using centralized config
import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import { CHAIN_CONFIG } from "../config/chains.js";
import pkg from "../../.papi/descriptors/dist/index.js";
const { westend2 } = pkg;

/**
 * Westend2 Relay Chain Service
 * Handles all Westend relay chain operations
 */
export class Westend2Service {
  constructor() {
    this.client = null;
    this.api = null;
    this.provider = null;
    this.isConnected = false;
    this.config = CHAIN_CONFIG.westend2; // Use centralized config
  }

  /**
   * Connect to Westend2 relay chain
   */
  async connect() {
    if (this.isConnected) {
      return { success: true, message: 'Already connected' };
    }

    try {
      console.log(`🔗 Connecting to ${this.config.name} via WebSocket...`);
      
      // Use WebSocket provider with config endpoint
      this.provider = withPolkadotSdkCompat(getWsProvider(this.config.wsEndpoint));
      this.client = createClient(this.provider);
      this.api = this.client.getTypedApi(westend2);
      
      // Quick connection test
      console.log(`✅ ${this.config.name} WebSocket connected`);
      
      this.isConnected = true;
      
      return {
        success: true,
        chainId: this.config.id,
        chainName: this.config.name,
        tokenSymbol: this.config.tokenSymbol,
        decimals: this.config.decimals,
        type: this.config.type
      };
      
    } catch (error) {
      console.log('❌ Westend2 connection failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get account portfolio on Westend2 (optimized with timeout)
   */
  async getAccountPortfolio(address) {
    const startTime = Date.now();
    
    try {
      // Ensure connection with timeout
      const connection = await Promise.race([
        this.connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Westend2 connection timeout')), 10000)
        )
      ]);
      
      if (!connection.success) {
        return connection;
      }

      console.log(`📊 Westend2: Analyzing ${address.slice(0, 8)}...`);
      
      // Query account info with timeout
      const accountInfo = await Promise.race([
        this.api.query.System.Account.getValue(address),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Westend2 account query timeout')), 8000)
        )
      ]);
      
      const analysisTime = Date.now() - startTime;
      
      // Process the data
      const portfolio = this.processAccountData(accountInfo);
      
      console.log(`✅ Westend2: ${portfolio.formatted.totalBalance} WND`);
      
      return {
        success: true,
        chainId: 'westend2',
        chainName: 'Westend Relay',
        address,
        portfolio,
        analysisTime,
        timestamp: new Date()
      };
      
    } catch (error) {
      const analysisTime = Date.now() - startTime;
      
      console.log(`❌ Westend2 portfolio failed:`, error.message);
      
      return {
        success: false,
        chainId: 'westend2',
        address,
        error: error.message,
        analysisTime,
        timestamp: new Date()
      };
    }
  }

  /**
   * Process Westend2 account data
   */
  processAccountData(accountInfo) {
    if (!accountInfo) {
      return {
        exists: false,
        freeBalance: '0',
        reservedBalance: '0',
        totalBalance: '0',
        nonce: 0,
        formatted: {
          freeBalance: '0',
          reservedBalance: '0', 
          totalBalance: '0',
          tokenSymbol: 'WND'
        }
      };
    }

    const freeBalance = accountInfo.data.free.toString();
    const reservedBalance = accountInfo.data.reserved.toString();
    const totalBalance = (accountInfo.data.free + accountInfo.data.reserved).toString();
    const nonce = accountInfo.nonce;
    
    return {
      exists: true,
      freeBalance,
      reservedBalance,
      totalBalance,
      nonce,
      formatted: {
        freeBalance: this.formatBalance(freeBalance),
        reservedBalance: this.formatBalance(reservedBalance),
        totalBalance: this.formatBalance(totalBalance),
        tokenSymbol: 'WND'
      }
    };
  }

  /**
   * Format balance for display
   */
  formatBalance(balance, decimals = 12) {
    const balanceBigInt = BigInt(balance);
    const divisor = BigInt(10 ** decimals);
    
    const wholePart = balanceBigInt / divisor;
    const fractionalPart = balanceBigInt % divisor;
    
    const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
    const trimmedFractional = fractionalStr.slice(0, 4).replace(/0+$/, '');
    
    if (trimmedFractional) {
      return `${wholePart}.${trimmedFractional}`;
    }
    
    return wholePart.toString();
  }

  /**
   * Test connection health
   */
  async testConnection() {
    const startTime = Date.now();
    
    try {
      const result = await this.connect();
      const connectionTime = Date.now() - startTime;
      
      return {
        ...result,
        connectionTime,
        health: this.calculateHealth(connectionTime)
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        connectionTime: Date.now() - startTime
      };
    }
  }

  /**
   * Calculate health score
   */
  calculateHealth(connectionTime) {
    if (connectionTime < 1000) return 95;
    if (connectionTime < 2000) return 85;
    if (connectionTime < 3000) return 75;
    if (connectionTime < 5000) return 65;
    return 50;
  }

  /**
   * Disconnect and cleanup
   */
  async disconnect() {
    try {
      if (this.client) {
        this.client.destroy();
      }
      
      if (this.provider && this.provider.disconnect) {
        this.provider.disconnect();
      }
      
      this.client = null;
      this.api = null;
      this.provider = null;
      this.isConnected = false;
      
      console.log('🧹 Westend2 disconnected');
      
    } catch (error) {
      console.log('⚠️ Westend2 disconnect error:', error.message);
    }
  }

  // Fee analysis methods for cross-chain comparison
  async getTransferFee(amount, destinationAddress) {
    try {
      await this.connect();
      
      // Create the transaction for fee estimation (using ex6 pattern)
      const tx = this.api.tx.Balances.transfer_keep_alive({
        dest: { type: "Id", value: destinationAddress },
        value: BigInt(amount)
      });

      // Estimate fees (using ex6 pattern)
      const estimatedFee = await tx.getEstimatedFees(destinationAddress);
      const fee = estimatedFee.toString();
      
      return {
        success: true,
        chainId: this.config.id,
        chainName: this.config.name,
        fee,
        feeFormatted: (parseFloat(fee) / Math.pow(10, this.config.decimals)).toFixed(6),
        tokenSymbol: this.config.tokenSymbol
      };
    } catch (error) {
      return {
        success: false,
        chainId: this.config.id,
        chainName: this.config.name,
        error: error.message || "Fee estimation failed"
      };
    }
  }
}

// Export singleton instance
export const westend2Service = new Westend2Service();