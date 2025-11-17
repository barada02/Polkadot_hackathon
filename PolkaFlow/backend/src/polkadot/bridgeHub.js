import { createClient } from "polkadot-api";
import { getWsProvider } from "polkadot-api/ws-provider/web";
import { westend2_bridge_hub } from "@polkadot-api/descriptors";
import { CHAIN_CONFIG } from "../config/chains.js";

class BridgeHubService {
  constructor(chainId = "westend2_bridge_hub") {
    this.config = CHAIN_CONFIG[chainId];
    this.client = null;
    this.api = null;
  }

  async connect() {
    if (this.api) return this.api;
    
    try {
      this.client = createClient(getWsProvider(this.config.wsEndpoint));
      this.api = this.client.getTypedApi(westend2_bridge_hub);
      return this.api;
    } catch (error) {
      console.error(`Failed to connect to ${this.config.name}:`, error);
      throw error;
    }
  }

  async getAccountPortfolio(address, timeout = 15000) {
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
      
      // Create the transaction for fee estimation (using ex6 pattern)
      const tx = api.tx.Balances.transfer_keep_alive({
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

  async getXcmFee(destinationChain, amount) {
    // Bridge Hub has special XCM capabilities for cross-ecosystem bridges
    // This is a key differentiator for Bridge Hub
    return {
      success: false,
      message: "XCM fee estimation not yet implemented for Bridge Hub (cross-ecosystem bridges)",
      chainId: this.config.id,
      destinationChain,
      note: "Bridge Hub specializes in cross-ecosystem transfers (Polkadot <-> Kusama, etc.)"
    };
  }
}

export { BridgeHubService };
export default BridgeHubService;