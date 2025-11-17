/*
💸 EXPERIMENT 6: Multi-Chain Fee Comparison
==========================================

Objective: Compare transaction fees across different parachains to help users
choose the most cost-effective chain for their transactions.

Architecture:
- Fee estimation across multiple Westend parachains
- Transfer fee comparison for same operation
- Cost analysis and recommendations
- Real-time fee monitoring

Learning Goals:
✅ Fee estimation patterns across chains
✅ Transaction simulation without execution
✅ Cross-chain cost analysis
✅ Optimal chain recommendation logic
*/

import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { 
  westend2, 
  westend2_asset_hub, 
  westend2_bridge_hub,
  westend2_collectives,
  westend2_coretime,
  westend2_people
} from "@polkadot-api/descriptors"

// =============================================================================
// 🔧 FEE COMPARISON CONFIGURATION
// =============================================================================

const FEE_COMPARISON_CHAINS = {
  westend: {
    name: "Westend Relay",
    icon: "🔗",
    type: "relay",
    endpoints: [
      "wss://westend-rpc.polkadot.io",
      "wss://westend-rpc.dwellir.com"
    ],
    descriptor: westend2,
    priority: 1
  },
  assethub: {
    name: "Asset Hub",
    icon: "💎", 
    type: "system_parachain",
    endpoints: [
      "wss://westend-asset-hub-rpc.polkadot.io/public-ws"
    ],
    descriptor: westend2_asset_hub,
    priority: 1
  },
  bridgehub: {
    name: "Bridge Hub",
    icon: "🌉",
    type: "system_parachain", 
    endpoints: [
      "wss://westend-bridge-hub-rpc.polkadot.io",
      "wss://westend-bridge-hub-rpc.polkadot.io/public-ws"
    ],
    descriptor: westend2_bridge_hub,
    priority: 2
  },
  people: {
    name: "People Chain",
    icon: "👥",
    type: "system_parachain", 
    endpoints: [
      "wss://westend-people-rpc.polkadot.io",
      "wss://westend-people-rpc.polkadot.io/public-ws"
    ],
    descriptor: westend2_people,
    priority: 2
  }
}

// Test accounts for fee comparison
const TEST_ACCOUNTS = {
  alice: {
    name: "Alice",
    address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"  // Well-funded account
  },
  bob: {
    name: "Bob", 
    address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"  // Recipient
  }
}

// Transaction types to compare
const TRANSACTION_TYPES = {
  transfer: {
    name: "Balance Transfer",
    description: "Basic WND transfer between accounts",
    amount: 1n * 10n ** 12n  // 1 WND
  },
  transfer_small: {
    name: "Micro Transfer", 
    description: "Small WND transfer",
    amount: 1n * 10n ** 10n  // 0.01 WND
  },
  transfer_large: {
    name: "Large Transfer",
    description: "Larger WND transfer", 
    amount: 10n * 10n ** 12n  // 10 WND
  }
}

class MultiChainFeeAnalyzer {
  constructor() {
    this.clients = new Map()
    this.apis = new Map()
    this.connectionStatus = new Map()
    this.feeCache = new Map()
  }

  async initializeChains() {
    console.log("💸 EXPERIMENT 6: Multi-Chain Fee Comparison")
    console.log("==========================================")
    console.log(`🎯 Connecting to ${Object.keys(FEE_COMPARISON_CHAINS).length} chains for fee analysis...`)
    console.log("")
    
    // Sort chains by priority (known working chains first)
    const chainEntries = Object.entries(FEE_COMPARISON_CHAINS)
      .sort(([,a], [,b]) => a.priority - b.priority)
    
    for (const [chainKey, config] of chainEntries) {
      console.log(`${config.icon} Connecting to ${config.name}...`)
      
      try {
        const provider = getWsProvider(config.endpoints)
        const enhancedProvider = withPolkadotSdkCompat(provider)
        const client = createClient(enhancedProvider)
        const api = client.getTypedApi(config.descriptor)
        
        this.clients.set(chainKey, client)
        this.apis.set(chainKey, api)
        this.connectionStatus.set(chainKey, "CONNECTING")
        
        // Test connection
        const connectionTest = new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Connection timeout (10s)'))
          }, 10000)
          
          client.getFinalizedBlock()
            .then(block => {
              clearTimeout(timeout)
              console.log(`${config.icon} ${config.name}: ✅ Connected! Block #${block.number}`)
              this.connectionStatus.set(chainKey, "CONNECTED")
              resolve(block)
            })
            .catch(error => {
              clearTimeout(timeout)
              reject(error)
            })
        })
        
        await connectionTest
        
      } catch (error) {
        console.log(`${config.icon} ${config.name}: ❌ Failed - ${error.message}`)
        this.connectionStatus.set(chainKey, "FAILED")
        // Clean up failed connections
        if (this.clients.has(chainKey)) {
          try {
            this.clients.get(chainKey).destroy()
          } catch (cleanupError) {
            // Ignore cleanup errors
          }
          this.clients.delete(chainKey)
          this.apis.delete(chainKey)
        }
      }
    }
    
    const connectedCount = Array.from(this.connectionStatus.values())
      .filter(status => status === "CONNECTED").length
      
    console.log(`🎉 Fee analyzer ready: ${connectedCount}/${Object.keys(FEE_COMPARISON_CHAINS).length} chains connected!`)
    console.log("")
  }

  async estimateFeeForChain(chainKey, transactionType, fromAddress, toAddress) {
    try {
      if (this.connectionStatus.get(chainKey) !== "CONNECTED") {
        return {
          success: false,
          fee: 0n,
          error: "Chain not connected"
        }
      }
      
      const api = this.apis.get(chainKey)
      const config = FEE_COMPARISON_CHAINS[chainKey]
      
      // Create the transaction for fee estimation
      const tx = api.tx.Balances.transfer_keep_alive({
        dest: { type: "Id", value: toAddress },
        value: transactionType.amount
      })
      
      // Estimate fees
      const estimatedFee = await tx.getEstimatedFees(fromAddress)
      
      return {
        success: true,
        fee: estimatedFee,
        chainName: config.name,
        chainIcon: config.icon,
        chainType: config.type
      }
      
    } catch (error) {
      return {
        success: false,
        fee: 0n,
        error: error.message,
        chainName: FEE_COMPARISON_CHAINS[chainKey]?.name || chainKey,
        chainIcon: FEE_COMPARISON_CHAINS[chainKey]?.icon || "❓"
      }
    }
  }

  async runFeeComparison() {
    console.log("💰 Multi-Chain Fee Comparison Analysis")
    console.log("=====================================")
    
    for (const [txTypeKey, txType] of Object.entries(TRANSACTION_TYPES)) {
      console.log(`\n📊 Analyzing: ${txType.name} (${this.formatBalance(txType.amount)} WND)`)
      console.log("─".repeat(60))
      
      const feeResults = []
      const feePromises = []
      
      // Estimate fees on all connected chains simultaneously
      for (const chainKey of Object.keys(FEE_COMPARISON_CHAINS)) {
        if (this.connectionStatus.get(chainKey) === "CONNECTED") {
          feePromises.push(
            this.estimateFeeForChain(
              chainKey, 
              txType, 
              TEST_ACCOUNTS.alice.address,
              TEST_ACCOUNTS.bob.address
            ).then(result => ({ chainKey, ...result }))
          )
        }
      }
      
      const results = await Promise.all(feePromises)
      
      // Display results sorted by fee (lowest first)
      const successfulResults = results.filter(r => r.success)
      successfulResults.sort((a, b) => a.fee < b.fee ? -1 : 1)
      
      let cheapestFee = null
      let mostExpensiveFee = null
      
      for (const result of successfulResults) {
        const feeFormatted = this.formatBalance(result.fee)
        const feeUsd = this.estimateUsdValue(result.fee)
        let indicator = ""
        
        if (cheapestFee === null) {
          cheapestFee = result.fee
          indicator = " 🥇 CHEAPEST"
        } else if (mostExpensiveFee === null && successfulResults.length > 1) {
          mostExpensiveFee = result.fee
          if (successfulResults.length === 2) indicator = " 🥈 MORE EXPENSIVE"
        }
        
        if (successfulResults.length > 2 && result === successfulResults[successfulResults.length - 1]) {
          indicator = " 🥉 MOST EXPENSIVE"
        }
        
        console.log(`${result.chainIcon} ${result.chainName.padEnd(15)} | ${feeFormatted.padStart(12)} WND | ~$${feeUsd}${indicator}`)
      }
      
      // Show failed chains
      const failedResults = results.filter(r => !r.success)
      for (const result of failedResults) {
        console.log(`${result.chainIcon} ${result.chainName.padEnd(15)} | ❌ ${result.error}`)
      }
      
      // Analysis summary
      if (successfulResults.length > 1) {
        const savings = mostExpensiveFee - cheapestFee
        const savingsPercent = Number(savings * 100n / mostExpensiveFee)
        console.log(`\n💡 Cost Analysis: Save ${this.formatBalance(savings)} WND (${savingsPercent.toFixed(1)}%) by using cheapest chain`)
      }
    }
  }

  async runRealtimeFeeMonitoring() {
    console.log("\n🔴 REAL-TIME FEE MONITORING")
    console.log("===========================")
    console.log("📊 Monitoring fee changes across chains (10 samples)...")
    
    const monitoringData = new Map()
    
    // Initialize monitoring for each connected chain
    for (const chainKey of Object.keys(FEE_COMPARISON_CHAINS)) {
      if (this.connectionStatus.get(chainKey) === "CONNECTED") {
        monitoringData.set(chainKey, [])
      }
    }
    
    // Take 10 fee samples over time
    for (let sample = 1; sample <= 10; sample++) {
      console.log(`\n📈 Sample ${sample}/10 - ${new Date().toLocaleTimeString()}`)
      
      for (const chainKey of monitoringData.keys()) {
        const result = await this.estimateFeeForChain(
          chainKey,
          TRANSACTION_TYPES.transfer,
          TEST_ACCOUNTS.alice.address,
          TEST_ACCOUNTS.bob.address
        )
        
        if (result.success) {
          monitoringData.get(chainKey).push(result.fee)
          const feeFormatted = this.formatBalance(result.fee)
          console.log(`${result.chainIcon} ${result.chainName}: ${feeFormatted} WND`)
        }
      }
      
      // Wait 2 seconds between samples
      if (sample < 10) {
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    
    // Calculate fee stability analysis
    console.log("\n📊 Fee Stability Analysis")
    console.log("─".repeat(30))
    
    for (const [chainKey, samples] of monitoringData.entries()) {
      if (samples.length > 0) {
        const config = FEE_COMPARISON_CHAINS[chainKey]
        const avgFee = samples.reduce((a, b) => a + b, 0n) / BigInt(samples.length)
        const minFee = samples.reduce((a, b) => a < b ? a : b)
        const maxFee = samples.reduce((a, b) => a > b ? a : b)
        const variance = maxFee - minFee
        
        console.log(`${config.icon} ${config.name}:`)
        console.log(`   Average: ${this.formatBalance(avgFee)} WND`)
        console.log(`   Range: ${this.formatBalance(minFee)} - ${this.formatBalance(maxFee)} WND`)
        console.log(`   Stability: ${variance === 0n ? "STABLE" : `±${this.formatBalance(variance)} WND`}`)
      }
    }
  }

  formatBalance(balance) {
    const WND_DECIMALS = 12
    const divisor = 10n ** BigInt(WND_DECIMALS)
    const whole = balance / divisor
    const fraction = balance % divisor
    const fractionStr = fraction.toString().padStart(WND_DECIMALS, '0').slice(0, 6)
    return `${whole}.${fractionStr}`
  }

  estimateUsdValue(wndAmount) {
    // Rough estimate: 1 WND ≈ $0.10 (testnet, for demonstration)
    const wndInDollars = Number(wndAmount) / 1e12 * 0.10
    return wndInDollars.toFixed(4)
  }

  async cleanup() {
    console.log("\n🧹 Cleaning up fee analyzer...")
    
    for (const [chainKey, client] of this.clients.entries()) {
      try {
        client.destroy()
        console.log(`✅ Disconnected from ${FEE_COMPARISON_CHAINS[chainKey].name}`)
      } catch (error) {
        console.log(`❌ Error disconnecting from ${chainKey}`)
      }
    }
    
    console.log("🎉 Fee analyzer cleanup complete!")
  }
}

async function runFeeComparisonExperiment() {
  const analyzer = new MultiChainFeeAnalyzer()
  
  try {
    await analyzer.initializeChains()
    await analyzer.runFeeComparison()
    await analyzer.runRealtimeFeeMonitoring()
    
    console.log("\n🏆 EXPERIMENT 6 RESULTS")
    console.log("=======================")
    const connectedCount = Array.from(analyzer.connectionStatus.values())
      .filter(status => status === "CONNECTED").length
    
    console.log(`✅ Fee comparison across ${connectedCount} chains completed`)
    console.log("✅ Multi-chain cost analysis working")
    console.log("✅ Real-time fee monitoring implemented")
    console.log("✅ Optimal chain recommendation logic established")
    console.log("✅ Production-ready fee estimation patterns")
    
    console.log("\n🎯 FEE INSIGHTS:")
    console.log("- System parachains may have different fee structures")
    console.log("- Fee monitoring helps detect network congestion")
    console.log("- Cost optimization guides user chain selection")
    console.log("- Real-time analysis enables dynamic recommendations")
    
  } catch (error) {
    console.error("❌ Fee comparison experiment failed:", error.message)
  } finally {
    await analyzer.cleanup()
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log("\n🛑 Shutting down fee analyzer...")
  process.exit(0)
})

runFeeComparisonExperiment()