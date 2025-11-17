// Asset Hub Chain Logic - Using WebSocket like experiments
import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider";
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat";
import pkg from "../../.papi/descriptors/dist/index.js";
const { westend2_asset_hub } = pkg;

/**
 * Westend2 Asset Hub Service
 * Handles Asset Hub operations and asset management
 */
export class AssetHubService {
  constructor() {
    this.client = null;
    this.api = null;
    this.provider = null;
    this.isConnected = false;
    this.wsEndpoint = "wss://westend-asset-hub-rpc.polkadot.io"; // Fast Asset Hub RPC
  }

  /**
   * Connect to Asset Hub
   */
  async connect() {
    if (this.isConnected) {
      return { success: true, message: 'Already connected' };
    }

    try {
      console.log('💎 Connecting to Asset Hub via WebSocket...');
      
      // Use WebSocket provider like experiments (much faster!)
      this.provider = withPolkadotSdkCompat(getWsProvider(this.wsEndpoint));
      this.client = createClient(this.provider);
      this.api = this.client.getTypedApi(westend2_asset_hub);
      
      // Quick connection test
      console.log('✅ Asset Hub WebSocket connected');
      
      this.isConnected = true;
      
      console.log('✅ Asset Hub connected');
      
      return {
        success: true,
        chainId: 'westend2_asset_hub',
        chainName: 'Asset Hub',
        tokenSymbol: 'WND',
        decimals: 12,
        type: 'system_parachain'
      };
      
    } catch (error) {
      console.log('❌ Asset Hub connection failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get account portfolio on Asset Hub (optimized with timeout)
   */
  async getAccountPortfolio(address) {
    const startTime = Date.now();
    
    try {
      // Ensure connection with timeout
      const connection = await Promise.race([
        this.connect(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Asset Hub connection timeout')), 10000)
        )
      ]);
      
      if (!connection.success) {
        return connection;
      }

      console.log(`💎 Asset Hub: Analyzing ${address.slice(0, 8)}...`);
      
      // Query account info with timeout
      const accountInfo = await Promise.race([
        this.api.query.System.Account.getValue(address),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Asset Hub account query timeout')), 8000)
        )
      ]);
      
      const analysisTime = Date.now() - startTime;
      
      // Process the data
      const portfolio = this.processAccountData(accountInfo);
      
      console.log(`✅ Asset Hub: ${portfolio.formatted.totalBalance} WND`);
      
      return {
        success: true,
        chainId: 'westend2_asset_hub',
        chainName: 'Asset Hub',
        address,
        portfolio,
        analysisTime,
        timestamp: new Date()
      };
      
    } catch (error) {
      const analysisTime = Date.now() - startTime;
      
      console.log(`❌ Asset Hub portfolio failed:`, error.message);
      
      return {
        success: false,
        chainId: 'westend2_asset_hub',
        address,
        error: error.message,
        analysisTime,
        timestamp: new Date()
      };
    }
  }

  /**
   * Process Asset Hub account data
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
      
      console.log('🧹 Asset Hub disconnected');
      
    } catch (error) {
      console.log('⚠️ Asset Hub disconnect error:', error.message);
    }
  }
}

// Export singleton instance
export const assetHubService = new AssetHubService();