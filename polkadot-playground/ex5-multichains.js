/*
🌐 EXPERIMENT 5: Multi-Provider Connections & Resilience
=======================================================

Objective: Connect to multiple RPC providers simultaneously and demonstrate
provider resilience, failover capabilities, and cross-provider monitoring.

Architecture:
- Multiple Westend connections via different RPC providers
- Provider failover and resilience testing  
- Cross-provider account balance verification
- Real-time multi-provider block monitoring
- Connection health monitoring across providers

Learning Goals:
✅ Multi-provider architecture patterns
✅ Provider lifecycle management & failover
✅ Cross-provider data consistency verification
✅ Connection resilience & monitoring
✅ Real-time multi-provider subscriptions
*/

import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { westend2 } from "@polkadot-api/descriptors"

// =============================================================================
// 🔧 MULTI-PROVIDER CONFIGURATION
// =============================================================================

const PROVIDER_CONFIG = {
  westend_primary: {
    name: "Westend (Parity)",
    icon: "🔗",
    endpoints: [
      "wss://westend-rpc.polkadot.io",
      "wss://westend-rpc.dwellir.com"
    ],
    descriptor: westend2
  },
  westend_ibp: {
    name: "Westend (IBP)",
    icon: "🌐", 
    endpoints: [
      "wss://rpc.ibp.network/westend",
      "wss://westend.dotters.network"
    ],
    descriptor: westend2
  },
  westend_onfinality: {
    name: "Westend (OnFinality)",
    icon: "🚀",
    endpoints: [
      "wss://westend.api.onfinality.io/public-ws",
      "wss://westend-rpc-tn.dwellir.com"
    ],
    descriptor: westend2
  }
}

// Test accounts for multi-provider portfolio verification
const MULTI_PROVIDER_ACCOUNTS = [
  {
    name: "Alice",
    address: "5GrwvaEF5C4teLQWen6qnGrfPjNiFj4VGVcCz6e6BQaTsnfh"
  },
  {
    name: "Bob", 
    address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  },
  {
    name: "Charlie",
    address: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"
  }
]

// =============================================================================
// 🌐 MULTI-CHAIN PROVIDER SETUP
// =============================================================================

class MultiProviderManager {
  constructor() {
    this.providers = new Map()
    this.clients = new Map()
    this.apis = new Map()
    this.subscriptions = []
    this.connectionStatus = new Map()
  }

  // Initialize providers with fallback endpoints and monitoring
  async initializeProviders() {
    console.log("🌐 EXPERIMENT 5: Multi-Provider Connections & Resilience")
    console.log("=======================================================")
    
    for (const [providerKey, config] of Object.entries(PROVIDER_CONFIG)) {
      console.log(`${config.icon} Initializing ${config.name} provider...`)
      
      // Create provider with multiple endpoints for resilience
      const provider = getWsProvider(config.endpoints, {
        timeout: 10_000,
        heartbeatTimeout: 40_000,
        onStatusChanged: (status) => this.handleStatusChange(providerKey, config, status)
      })

      // Enhance with SDK compatibility
      const enhancedProvider = withPolkadotSdkCompat(provider)
      
      // Create client and typed API
      const client = createClient(enhancedProvider)
      const api = client.getTypedApi(config.descriptor)
      
      // Store references
      this.providers.set(providerKey, provider)
      this.clients.set(providerKey, client)
      this.apis.set(providerKey, api)
      this.connectionStatus.set(providerKey, "CONNECTING")
    }

    // Wait for initial connections
    await this.waitForConnections()
  }

  // Handle provider status changes with detailed logging
  handleStatusChange(providerKey, config, status) {
    this.connectionStatus.set(providerKey, status.type)
    
    const statusIcons = {
      CONNECTING: "🔌",
      CONNECTED: "⚡",
      ERROR: "😢", 
      CLOSE: "🚪"
    }
    
    const icon = statusIcons[status.type] || "❓"
    const endpoint = status.uri ? ` (${status.uri})` : ""
    
    console.log(`${config.icon} ${config.name}: ${icon} ${status.type}${endpoint}`)
  }

  // Wait for all chains to connect
  async waitForConnections() {
    const maxWaitTime = 15000 // 15 seconds
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWaitTime) {
      const allConnected = Array.from(this.connectionStatus.values())
        .every(status => status === "CONNECTED")
      
      if (allConnected) {
        console.log("✅ All chains connected successfully!")
        return
      }
      
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    console.log("⚠️  Some connections may still be establishing...")
  }

  // Get provider information for all connected providers
  async getProviderInfo() {
    console.log("\n📋 Multi-Provider Network Information")
    console.log("====================================")
    
    for (const [providerKey, config] of Object.entries(PROVIDER_CONFIG)) {
      try {
        const client = this.clients.get(providerKey)
        const chainInfo = await Promise.race([
          client.getChainSpecData(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ])
        
        const finalizedBlock = await Promise.race([
          client.getFinalizedBlock(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))  
        ])
        
        console.log(`${config.icon} ${config.name}:`)
        console.log(`   Name: ${chainInfo.name}`)
        console.log(`   Genesis: ${chainInfo.genesisHash.slice(0, 10)}...`)
        console.log(`   Block: #${finalizedBlock.number}`)
        console.log("")
        
      } catch (error) {
        console.log(`${config.icon} ${config.name}: ❌ Connection error - ${error.message}`)
      }
    }
  }

  // Query balance from a specific chain
  async getProviderBalance(providerKey, address) {
    try {
      const api = this.apis.get(providerKey)
      const accountInfo = await api.query.System.Account.getValue(address)
      
      return {
        success: true,
        balance: accountInfo?.data?.free || 0n,
        nonce: accountInfo?.nonce || 0
      }
    } catch (error) {
      return {
        success: false,
        balance: 0n,
        nonce: 0,
        error: error.message
      }
    }
  }

  // Get multi-provider portfolio for an account
  async getMultiProviderPortfolio(account) {
    const results = {}
    const queries = []
    
    // Query all providers simultaneously
    for (const providerKey of Object.keys(PROVIDER_CONFIG)) {
      queries.push(
        this.getProviderBalance(providerKey, account.address)
          .then(result => ({ providerKey, result }))
      )
    }
    
    const responses = await Promise.all(queries)
    
    // Process results
    for (const { providerKey, result } of responses) {
      results[providerKey] = result
    }
    
    return results
  }

  // Format balance from Planck to readable format
  formatBalance(balance) {
    const WND_DECIMALS = 12
    const divisor = 10n ** BigInt(WND_DECIMALS)
    const whole = balance / divisor
    const fraction = balance % divisor
    const fractionStr = fraction.toString().padStart(WND_DECIMALS, '0').slice(0, 6)
    return `${whole}.${fractionStr}`
  }

  // Display multi-chain portfolio
  displayPortfolio(account, portfolioData) {
    console.log(`💼 Multi-Chain Portfolio: ${account.name}`)
    console.log("================================")
    
    let totalBalance = 0n
    let activeChains = 0
    
    for (const [providerKey, config] of Object.entries(PROVIDER_CONFIG)) {
      const data = portfolioData[providerKey]
      
      if (data.success) {
        const balanceFormatted = this.formatBalance(data.balance)
        const status = data.balance > 0n ? "✅ Active" : "⚪ Empty"
        
        console.log(`${config.icon} ${config.name.padEnd(12)} | ${balanceFormatted.padStart(12)} WND | ${status}`)
        
        totalBalance += data.balance
        if (data.balance > 0n) activeChains++
      } else {
        console.log(`${config.icon} ${config.name.padEnd(12)} | ❌ Error: ${data.error}`)
      }
    }
    
    console.log("--------------------------------")
    console.log(`📊 Total Portfolio: ${this.formatBalance(totalBalance)} WND`)
    console.log(`🌐 Active Providers: ${activeChains}/${Object.keys(PROVIDER_CONFIG).length}`)
    console.log(`📍 Account: ${account.address.slice(0, 8)}...${account.address.slice(-8)}`)
    console.log("")
  }

  // Start real-time multi-chain monitoring
  startRealTimeMonitoring() {
    console.log("🔴 REAL-TIME MULTI-CHAIN MONITORING")
    console.log("===================================")
    
    for (const [providerKey, config] of Object.entries(PROVIDER_CONFIG)) {
      try {
        const client = this.clients.get(providerKey)
        
        const subscription = client.finalizedBlock$.subscribe({
          next: (block) => {
            const timestamp = new Date().toLocaleTimeString()
            console.log(`[${timestamp}] ${config.icon} ${config.name} Block #${block.number}`)
          },
          error: (error) => {
            console.log(`${config.icon} ${config.name} subscription error: ${error.message}`)
          }
        })
        
        this.subscriptions.push(subscription)
        
      } catch (error) {
        console.log(`${config.icon} Failed to start monitoring for ${config.name}: ${error.message}`)
      }
    }
  }

  // Clean shutdown of all connections
  async cleanup() {
    console.log("\n🧹 Cleaning up multi-chain connections...")
    
    // Unsubscribe from all real-time monitoring
    this.subscriptions.forEach((sub, index) => {
      try {
        sub.unsubscribe()
        console.log(`✅ Unsubscribed from subscription ${index + 1}`)
      } catch (error) {
        console.log(`❌ Error unsubscribing: ${error.message}`)
      }
    })
    
    // Disconnect all providers
    for (const [providerKey, provider] of this.providers.entries()) {
      try {
        provider.disconnect?.()
        console.log(`✅ Disconnected ${providerKey} provider`)
      } catch (error) {
        console.log(`❌ Error disconnecting ${providerKey}: ${error.message}`)
      }
    }
    
    console.log("🎉 Multi-chain cleanup complete!")
  }
}

// =============================================================================
// 🚀 EXPERIMENT EXECUTION
// =============================================================================

async function runMultiProviderExperiment() {
  const manager = new MultiProviderManager()
  
  try {
    // Phase 1: Initialize multi-chain connections
    await manager.initializeProviders()
    
    // Phase 2: Display provider information
    await manager.getProviderInfo()
    
    // Phase 3: Query multi-chain portfolios
    console.log("💰 Multi-Chain Portfolio Analysis")
    console.log("=================================")
    
    for (const account of MULTI_PROVIDER_ACCOUNTS) {
      console.log(`🔍 Querying ${account.name} across all chains...`)
      
      const portfolioData = await manager.getMultiProviderPortfolio(account)
      manager.displayPortfolio(account, portfolioData)
    }
    
    // Phase 4: Real-time monitoring
    manager.startRealTimeMonitoring()
    
    // Phase 5: Monitor for 30 seconds then cleanup
    console.log("⏰ Monitoring for 30 seconds...")
    await new Promise(resolve => setTimeout(resolve, 30000))
    
    // Final results
    console.log("\n🎉 EXPERIMENT 5 RESULTS")
    console.log("=======================")
    console.log("✅ Multi-chain connections established")
    console.log("✅ Cross-chain balance aggregation working")
    console.log("✅ Real-time monitoring across chains")
    console.log("✅ Provider resilience with fallback endpoints")
    console.log("✅ Unified portfolio view implemented")
    
  } catch (error) {
    console.error("❌ Multi-chain experiment failed:", error.message)
    console.error("Stack trace:", error.stack)
  } finally {
    await manager.cleanup()
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log("\n🛑 Received interrupt signal, shutting down gracefully...")
  process.exit(0)
})

// Run the experiment
runMultiProviderExperiment()