import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { westend2_people } from "polkadot-api/descriptors";
import { CHAIN_CONFIG } from "../config/chains.js";

class PeopleService {
  constructor(chainId = "westend2_people") {
    this.config = CHAIN_CONFIG[chainId];
    this.client = null;
    this.api = null;
  }

  async connect() {
    if (this.api) return this.api;
    
    try {
      this.client = createClient(getWsProvider(this.config.wsEndpoint));
      this.api = this.client.getTypedApi(westend2_people);
      return this.api;
    } catch (error) {
      console.error(`Failed to connect to ${this.config.name}:`, error);
      throw error;
    }
  }

  async analyzePortfolio(address, timeout = 15000) {
    const startTime = Date.now();
    
    try {
      const api = await this.connect();
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`${this.config.name} connection timeout`)), timeout)
      );

      // Get account info with timeout
      const accountInfo = await Promise.race([
        api.query.System.Account.getValue(address),
        timeoutPromise
      ]);

      const analysisTime = Date.now() - startTime;

      if (!accountInfo) {
        return {
          success: true,
          chainId: this.config.id,
          chainName: this.config.name,
          address,
          portfolio: {
            exists: false,
            message: "Account not found on chain"
          },
          analysisTime,
          timestamp: new Date().toISOString()
        };
      }

      // Format balances using chain decimals
      const decimals = this.config.decimals;
      const divisor = Math.pow(10, decimals);

      const freeBalance = accountInfo.data.free.toString();
      const reservedBalance = accountInfo.data.reserved.toString();
      const totalBalance = (BigInt(freeBalance) + BigInt(reservedBalance)).toString();

      return {
        success: true,
        chainId: this.config.id,
        chainName: this.config.name,
        address,
        portfolio: {
          exists: true,
          freeBalance,
          reservedBalance,
          totalBalance,
          nonce: accountInfo.nonce,
          formatted: {
            freeBalance: (parseFloat(freeBalance) / divisor).toFixed(4),
            reservedBalance: (parseFloat(reservedBalance) / divisor).toFixed(4),
            totalBalance: (parseFloat(totalBalance) / divisor).toFixed(4),
            tokenSymbol: this.config.tokenSymbol
          }
        },
        analysisTime,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      const analysisTime = Date.now() - startTime;
      console.error(`${this.config.name} portfolio analysis failed:`, error);
      
      return {
        success: false,
        chainId: this.config.id,
        chainName: this.config.name,
        address,
        error: error.message || `${this.config.name} analysis failed`,
        analysisTime,
        timestamp: new Date().toISOString()
      };
    }
  }

  async disconnect() {
    if (this.client) {
      try {
        this.client.destroy();
        this.client = null;
        this.api = null;
      } catch (error) {
        console.error(`Error disconnecting from ${this.config.name}:`, error);
      }
    }
  }

  // Fee analysis methods for cross-chain comparison
  async getTransferFee(amount, destinationAddress) {
    try {
      const api = await this.connect();
      
      // Get fee for a basic transfer
      const transferTx = api.tx.Balances.transfer_keep_alive({
        dest: destinationAddress,
        value: BigInt(amount)
      });

      const feeInfo = await transferTx.getEstimatedFees(destinationAddress);
      
      return {
        success: true,
        chainId: this.config.id,
        chainName: this.config.name,
        fee: feeInfo.toString(),
        feeFormatted: (parseFloat(feeInfo.toString()) / Math.pow(10, this.config.decimals)).toFixed(6),
        tokenSymbol: this.config.tokenSymbol
      };
    } catch (error) {
      return {
        success: false,
        chainId: this.config.id,
        error: error.message || "Fee estimation failed"
      };
    }
  }

  async getXcmFee(destinationChain, amount) {
    // Placeholder for XCM fee estimation
    // Will be implemented when XCM routes are established
    return {
      success: false,
      message: "XCM fee estimation not yet implemented for People Chain",
      chainId: this.config.id,
      destinationChain
    };
  }
}

export { PeopleService };
export default PeopleService;