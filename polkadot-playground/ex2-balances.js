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
        console.log("=" . repeat(60))
        
        for (const account of testAccounts) {
            try {
                // Query account info (includes balance)
                const accountInfo = await client.query("System", "Account", [account])
                
                // Extract balance from account info
                const balance = accountInfo?.data?.free || 0n
                
                // Convert from Planck (smallest unit) to WND (Westend token)
                // Westend has 12 decimal places (like DOT)
                const balanceInWND = Number(balance) / Math.pow(10, 12)
                
                // Display results
                console.log(`Account: ${account.slice(0, 8)}...${account.slice(-8)}`)
                console.log(`Balance: ${balanceInWND.toFixed(4)} WND`)
                console.log(`Raw:     ${balance.toString()} Planck`)
                console.log("-" . repeat(40))
                
            } catch (error) {
                console.log(`❌ Failed to query ${account.slice(0, 8)}: ${error.message}`)
            }
        }
        
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