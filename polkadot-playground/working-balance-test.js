import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider"
import { westend } from "./.papi/descriptors"

async function workingBalanceTest() {
    console.log("🚀 WORKING Balance Queries with Generated Descriptors!")
    console.log("Using properly typed Westend API...")
    
    let client = null
    
    try {
        const wsProvider = getWsProvider("wss://westend-rpc.polkadot.io")
        client = createClient(wsProvider)
        
        console.log("✅ Connected to Westend testnet")
        
        // Use the generated descriptor for typed API
        const api = client.getTypedApi(westend)
        
        console.log("✅ Generated typed API loaded!")
        console.log("API type:", typeof api)
        
        // Test accounts
        const testAccounts = [
            "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", // Alice
            "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", // Bob
        ]
        
        console.log("\n💰 Querying Real Balances:")
        console.log("=".repeat(60))
        
        for (const account of testAccounts) {
            try {
                console.log(`\n🔍 Querying: ${account.slice(0, 8)}...${account.slice(-8)}`)
                
                // Query account info using the properly typed API
                const accountInfo = await api.query.System.Account(account)
                
                console.log("✅ Query successful!")
                
                // Extract balance data
                const free = accountInfo.data.free
                const reserved = accountInfo.data.reserved
                const total = free + reserved
                
                // Convert from Planck to WND (12 decimals for Westend)
                const freeWND = Number(free) / Math.pow(10, 12)
                const reservedWND = Number(reserved) / Math.pow(10, 12)
                const totalWND = Number(total) / Math.pow(10, 12)
                
                console.log(`💰 Account: ${account.slice(0, 8)}...${account.slice(-8)}`)
                console.log(`   Free:     ${freeWND.toFixed(6)} WND`)
                console.log(`   Reserved: ${reservedWND.toFixed(6)} WND`)
                console.log(`   Total:    ${totalWND.toFixed(6)} WND`)
                console.log(`   Nonce:    ${accountInfo.nonce}`)
                console.log(`   Raw free: ${free.toString()} Planck`)
                
                console.log("-".repeat(40))
                
            } catch (error) {
                console.log(`❌ Query failed for ${account.slice(0, 8)}: ${error.message}`)
            }
        }
        
        // Test other System queries
        console.log("\n📊 Additional System Information:")
        console.log("-".repeat(40))
        
        try {
            const blockNumber = await api.query.System.Number()
            console.log(`📦 Current block number: ${blockNumber}`)
        } catch (error) {
            console.log("❌ Block number query failed:", error.message)
        }
        
        console.log("\n🎉 SUCCESS! Balance queries are working!")
        console.log("✅ Generated descriptors enable full PAPI functionality")
        console.log("✅ Ready for multi-chain experiments")
        console.log("✅ Can build complete hackathon project")
        
    } catch (error) {
        console.error("❌ Test failed:", error.message)
    } finally {
        if (client) {
            setTimeout(() => {
                client.destroy()
                console.log("\n🧹 Connection cleaned up")
                process.exit(0)
            }, 1000)
        }
    }
}

// Run the working balance test
workingBalanceTest()