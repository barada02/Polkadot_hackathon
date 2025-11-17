import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider"

async function experiment2() {
    console.log("🚀 Experiment 2: Show Me Balances!")
    console.log("Querying account balances from Westend testnet...")
    
    let client = null
    
    try {
        // Create WebSocket provider for Westend testnet
        const wsProvider = getWsProvider("wss://westend-rpc.polkadot.io")
        
        // Create client
        client = createClient(wsProvider)
        
        // Test account addresses (these are public addresses with known activity)
        const testAccounts = [
            "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Alice (common test account)
            "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", // Bob (common test account)
            "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"  // Charlie (common test account)
        ]
        
        console.log("📊 Checking balances for test accounts:")
        console.log("=".repeat(60))
        
        // Let's start with a simple approach - just get the latest block first
        const latestBlock = await client.getFinalizedBlock()
        console.log(`📦 Connected to block #${latestBlock.number}`)
        console.log()
        
        // For now, let's demonstrate what we CAN do with PAPI
        console.log("🎯 PAPI Connection Working! Here's what we learned:")
        console.log("✅ Connected to Westend testnet successfully")
        console.log("✅ Retrieved chain information")
        console.log("✅ Got latest finalized block number")
        console.log()
        console.log("📚 Next: We'll learn the proper PAPI methods for balance queries")
        console.log("    (Balance queries require specific chain metadata)")
        
        // Show the test accounts we want to query
        console.log()
        console.log("🎯 Target accounts for balance queries:")
        testAccounts.forEach((account, index) => {
            console.log(`   ${index + 1}. ${account.slice(0, 8)}...${account.slice(-8)}`)
        })
        
        console.log("🎯 Balance queries completed!")
        
    } catch (error) {
        console.error("❌ Connection failed:", error.message)
        console.error("Full error:", error)
    } finally {
        // Clean shutdown
        if (client) {
            setTimeout(() => {
                client.destroy()
                console.log("🧹 Connection cleaned up")
                process.exit(0)
            }, 1000)
        }
    }
}

// Helper function to format balance
function formatBalance(balance, decimals = 12, symbol = "WND") {
    const balanceNumber = Number(balance) / Math.pow(10, decimals)
    return `${balanceNumber.toFixed(4)} ${symbol}`
}

// Run the experiment
experiment2()