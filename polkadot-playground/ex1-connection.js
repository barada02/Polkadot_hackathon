import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider"  // Updated import path

async function experiment1() {
    console.log("🚀 Experiment 1: Hello Polkadot!")
    console.log("Attempting to connect to Westend testnet...")
    
    let client = null
    
    try {
        // Create WebSocket provider for Westend testnet
        const wsProvider = getWsProvider("wss://westend-rpc.polkadot.io")
        
        // Create client
        client = createClient(wsProvider)
        
        // Get chain information
        const chainInfo = await client.getChainSpecData()
        
        console.log("✅ Successfully connected!")
        console.log("Chain name:", chainInfo.name)
        console.log("Chain genesis hash:", chainInfo.genesisHash)
        
        console.log("🎯 Experiment 1 completed successfully!")
        
    } catch (error) {
        console.error("❌ Connection failed:", error.message)
    } finally {
        // Clean shutdown with delay to allow pending operations
        if (client) {
            setTimeout(() => {
                client.destroy()
                console.log("🧹 Connection cleaned up")
                process.exit(0)
            }, 1000)
        }
    }
}

// Run the experiment
experiment1()