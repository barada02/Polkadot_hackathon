// Shared Smoldot Instance Manager
import { start } from "polkadot-api/smoldot";

/**
 * Singleton Smoldot Manager
 * Manages a single Smoldot instance shared across all chains
 * Prevents resource conflicts and connection issues
 */
class SmoldotManager {
  constructor() {
    this.smoldot = null;
    this.isInitialized = false;
    this.initPromise = null;
  }

  /**
   * Get or create the shared Smoldot instance
   */
  async getSmoldot() {
    if (this.isInitialized && this.smoldot) {
      return this.smoldot;
    }

    // Prevent multiple simultaneous initializations
    if (this.initPromise) {
      return await this.initPromise;
    }

    this.initPromise = this._initializeSmoldot();
    return await this.initPromise;
  }

  /**
   * Initialize Smoldot (private method)
   */
  async _initializeSmoldot() {
    try {
      console.log('🔧 Initializing shared Smoldot instance...');
      
      this.smoldot = start();
      this.isInitialized = true;
      
      console.log('✅ Shared Smoldot instance ready');
      
      return this.smoldot;
      
    } catch (error) {
      console.log('❌ Smoldot initialization failed:', error.message);
      this.initPromise = null;
      throw error;
    }
  }

  /**
   * Check if Smoldot is ready
   */
  isReady() {
    return this.isInitialized && this.smoldot !== null;
  }

  /**
   * Terminate Smoldot and cleanup
   */
  async terminate() {
    try {
      if (this.smoldot) {
        console.log('🛑 Terminating shared Smoldot instance...');
        this.smoldot.terminate();
      }
      
      this.smoldot = null;
      this.isInitialized = false;
      this.initPromise = null;
      
      console.log('✅ Smoldot terminated');
      
    } catch (error) {
      console.log('⚠️ Error terminating Smoldot:', error.message);
    }
  }
}

// Export singleton instance
export const smoldotManager = new SmoldotManager();

// Graceful shutdown handlers
process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, cleaning up Smoldot...');
  await smoldotManager.terminate();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, cleaning up Smoldot...');
  await smoldotManager.terminate();
  process.exit(0);
});

process.on('beforeExit', async () => {
  console.log('🛑 Process exiting, cleaning up Smoldot...');
  await smoldotManager.terminate();
});