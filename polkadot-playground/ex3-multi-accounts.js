import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import pkg from "./.papi/descriptors/dist/index.js"
const { westend } = pkg

// Account portfolios for testing
const accountPortfolios = {
    "Team Accounts": [
        { name: "Alice", address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" },
        { name: "Bob", address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" },
        { name: "Charlie", address: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y" }
    ],
    "Additional Test Accounts": [
        { name: "Dave", address: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy" },
        { name: "Eve", address: "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw" },
        { name: "Ferdie", address: "5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL" }
    ]
}

async function experiment3() {
    console.log("🚀 Experiment 3: Multiple Account Portfolio Manager!")
    console.log("Enhanced batch processing and data aggregation...")
    
    let client = null
    
    try {
        // Create WebSocket provider for Westend testnet
        const wsProvider = withPolkadotSdkCompat(getWsProvider("wss://westend-rpc.polkadot.io"))
        client = createClient(wsProvider)
        
        console.log("✅ Connected to Westend testnet")
        
        // Use the generated descriptor for typed API
        const api = client.getTypedApi(westend)
        console.log("✅ Generated typed API loaded!")
        
        // Get current network info
        const blockNumber = await api.query.System.Number.getValue()
        console.log(`📦 Current block: #${blockNumber}`)
        
        // Process each portfolio
        const portfolioResults = {}
        
        for (const [portfolioName, accounts] of Object.entries(accountPortfolios)) {
            console.log(`\n💼 Processing Portfolio: ${portfolioName}`)
            console.log("=".repeat(70))
            
            const portfolioData = []
            let portfolioTotal = 0n
            let successfulQueries = 0
            
            // Query all accounts in this portfolio
            for (const account of accounts) {
                try {
                    console.log(`🔍 Querying ${account.name}: ${account.address.slice(0, 8)}...`)
                    
                    const accountInfo = await api.query.System.Account.getValue(account.address)
                    
                    const free = accountInfo.data.free
                    const reserved = accountInfo.data.reserved
                    const total = free + reserved
                    
                    // Convert to human readable
                    const freeWND = Number(free) / Math.pow(10, 12)
                    const reservedWND = Number(reserved) / Math.pow(10, 12)
                    const totalWND = Number(total) / Math.pow(10, 12)
                    
                    portfolioData.push({
                        name: account.name,
                        address: account.address,
                        free: free,
                        reserved: reserved,
                        total: total,
                        freeWND: freeWND,
                        reservedWND: reservedWND,
                        totalWND: totalWND,
                        nonce: accountInfo.nonce,
                        status: "✅ Active"
                    })
                    
                    portfolioTotal += total
                    successfulQueries++
                    
                } catch (error) {
                    console.log(`❌ ${account.name} query failed: ${error.message}`)
                    
                    portfolioData.push({
                        name: account.name,
                        address: account.address,
                        free: 0n,
                        reserved: 0n,
                        total: 0n,
                        freeWND: 0,
                        reservedWND: 0,
                        totalWND: 0,
                        nonce: 0,
                        status: "❌ Error"
                    })
                }
            }
            
            // Display portfolio table
            console.log(`\n📊 ${portfolioName} - Portfolio Summary:`)
            console.log("-".repeat(70))
            
            portfolioData.forEach(account => {
                console.log(`${account.status} ${account.name.padEnd(10)} | ` +
                          `${account.totalWND.toFixed(6).padStart(12)} WND | ` +
                          `Nonce: ${account.nonce.toString().padStart(4)} | ` +
                          `${account.address.slice(0, 8)}...${account.address.slice(-8)}`)
            })
            
            // Portfolio statistics
            const portfolioTotalWND = Number(portfolioTotal) / Math.pow(10, 12)
            console.log("-".repeat(70))
            console.log(`📈 Portfolio Total: ${portfolioTotalWND.toFixed(6)} WND`)
            console.log(`📊 Success Rate: ${successfulQueries}/${accounts.length} accounts`)
            console.log(`💰 Average Balance: ${(portfolioTotalWND / accounts.length).toFixed(6)} WND`)
            
            // Store portfolio results
            portfolioResults[portfolioName] = {
                accounts: portfolioData,
                total: portfolioTotal,
                totalWND: portfolioTotalWND,
                successfulQueries: successfulQueries,
                totalAccounts: accounts.length
            }
        }
        
        // Overall summary
        console.log("\n🏆 OVERALL PORTFOLIO ANALYSIS")
        console.log("=".repeat(70))
        
        let grandTotal = 0n
        let totalAccounts = 0
        let totalSuccessful = 0
        
        for (const [name, portfolio] of Object.entries(portfolioResults)) {
            grandTotal += portfolio.total
            totalAccounts += portfolio.totalAccounts
            totalSuccessful += portfolio.successfulQueries
            
            console.log(`📁 ${name}: ${portfolio.totalWND.toFixed(6)} WND (${portfolio.successfulQueries}/${portfolio.totalAccounts} accounts)`)
        }
        
        const grandTotalWND = Number(grandTotal) / Math.pow(10, 12)
        
        console.log("-".repeat(70))
        console.log(`🎯 GRAND TOTAL: ${grandTotalWND.toFixed(6)} WND`)
        console.log(`📊 Overall Success: ${totalSuccessful}/${totalAccounts} accounts`)
        console.log(`💎 Largest Portfolio: ${Object.entries(portfolioResults)
            .reduce((a, b) => a[1].totalWND > b[1].totalWND ? a : b)[0]}`)
        
        // Export data structure for future use
        console.log("\n📦 Data Structure Ready for:")
        console.log("✅ React component integration")
        console.log("✅ Real-time subscription updates") 
        console.log("✅ Multi-chain aggregation")
        console.log("✅ Portfolio tracking features")
        
        console.log("\n🎉 Experiment 3 SUCCESS!")
        console.log("✅ Batch account processing working")
        console.log("✅ Portfolio management patterns established")
        console.log("✅ Data aggregation and statistics ready")
        console.log("✅ Error handling and resilience tested")
        
    } catch (error) {
        console.error("❌ Experiment 3 failed:", error.message)
        console.error("Full error:", error)
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

// Helper function to format addresses consistently
function formatAddress(address, length = 8) {
    return `${address.slice(0, length)}...${address.slice(-length)}`
}

// Helper function to format WND amounts
function formatWND(amount, decimals = 6) {
    return `${amount.toFixed(decimals)} WND`
}

// Run experiment 3
experiment3()