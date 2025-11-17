import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import pkg from "./.papi/descriptors/dist/index.js"
const { westend } = pkg

// Portfolio accounts to monitor (from Experiment 3)
const watchedAccounts = [
    { name: "Alice", address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" },
    { name: "Bob", address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty" },
    { name: "Charlie", address: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y" }
]

// Store for tracking balance changes
const portfolioState = new Map()

async function experiment4() {
    console.log("🚀 Experiment 4: Real-time Portfolio Monitor!")
    console.log("Setting up live subscriptions for balance changes...")
    
    let client = null
    let subscriptions = []
    
    try {
        // Create WebSocket provider for Westend testnet
        const wsProvider = withPolkadotSdkCompat(getWsProvider("wss://westend-rpc.polkadot.io"))
        client = createClient(wsProvider)
        
        console.log("✅ Connected to Westend testnet")
        
        // Use the generated descriptor for typed API
        const api = client.getTypedApi(westend)
        console.log("✅ Generated typed API loaded!")
        
        // Initialize portfolio state with current balances
        console.log("\n📊 Initializing Portfolio State...")
        console.log("=".repeat(60))
        
        for (const account of watchedAccounts) {
            try {
                const accountInfo = await api.query.System.Account.getValue(account.address)
                const currentBalance = Number(accountInfo.data.free + accountInfo.data.reserved) / Math.pow(10, 12)
                
                portfolioState.set(account.address, {
                    name: account.name,
                    currentBalance: currentBalance,
                    lastNonce: accountInfo.nonce,
                    lastUpdate: new Date(),
                    changeCount: 0
                })
                
                console.log(`✅ ${account.name}: ${currentBalance.toFixed(6)} WND (Nonce: ${accountInfo.nonce})`)
            } catch (error) {
                console.log(`❌ Failed to initialize ${account.name}: ${error.message}`)
            }
        }
        
        console.log("\n🔴 Starting Real-time Subscriptions...")
        console.log("=".repeat(60))
        
        // Subscription 1: Monitor finalized blocks
        console.log("📦 Subscribing to finalized blocks...")
        const blockSubscription = client.finalizedBlock$.subscribe({
            next: (block) => {
                const timestamp = new Date().toLocaleTimeString()
                console.log(`📦 [${timestamp}] New finalized block #${block.number} | Hash: ${block.hash.slice(0, 10)}...`)
                
                // Trigger balance checks on new blocks (every few blocks to avoid spam)
                if (block.number % 3 === 0) {
                    checkBalanceChanges(api, block.number)
                }
            },
            error: (error) => {
                console.log("❌ Block subscription error:", error.message)
            }
        })
        subscriptions.push(blockSubscription)
        
        // Function to check balance changes
        async function checkBalanceChanges(api, blockNumber) {
            try {
                for (const account of watchedAccounts) {
                    const accountInfo = await api.query.System.Account.getValue(account.address)
                    const newBalance = Number(accountInfo.data.free + accountInfo.data.reserved) / Math.pow(10, 12)
                    const currentState = portfolioState.get(account.address)
                    
                    if (currentState && newBalance !== currentState.currentBalance) {
                        const change = newBalance - currentState.currentBalance
                        const timestamp = new Date().toLocaleTimeString()
                        
                        console.log(`💰 [${timestamp}] ${account.name} balance changed!`)
                        console.log(`   Previous: ${currentState.currentBalance.toFixed(6)} WND`)
                        console.log(`   Current:  ${newBalance.toFixed(6)} WND`)
                        console.log(`   Change:   ${change > 0 ? '+' : ''}${change.toFixed(6)} WND`)
                        console.log(`   Block:    #${blockNumber}`)
                        
                        // Update state
                        portfolioState.set(account.address, {
                            ...currentState,
                            currentBalance: newBalance,
                            lastUpdate: new Date(),
                            changeCount: currentState.changeCount + 1
                        })
                    }
                    
                    // Check for nonce changes (transactions)
                    if (currentState && accountInfo.nonce !== currentState.lastNonce) {
                        const timestamp = new Date().toLocaleTimeString()
                        console.log(`📝 [${timestamp}] ${account.name} transaction detected! Nonce: ${currentState.lastNonce} → ${accountInfo.nonce}`)
                        
                        portfolioState.set(account.address, {
                            ...portfolioState.get(account.address),
                            lastNonce: accountInfo.nonce
                        })
                    }
                }
            } catch (error) {
                console.log(`❌ Balance check failed: ${error.message}`)
            }
        }
        
        // Display current monitoring status
        console.log(`✅ Monitoring ${watchedAccounts.length} accounts for balance changes`)
        console.log(`✅ Checking balances every 3 blocks`)
        console.log(`✅ Real-time block updates active`)
        
        // Periodic portfolio summary
        const summaryInterval = setInterval(() => {
            console.log("\n📊 Portfolio Status Summary:")
            console.log("-".repeat(50))
            let totalBalance = 0
            
            for (const [address, state] of portfolioState) {
                totalBalance += state.currentBalance
                const timeSinceUpdate = Math.floor((new Date() - state.lastUpdate) / 1000)
                console.log(`${state.name}: ${state.currentBalance.toFixed(6)} WND | ` +
                          `Changes: ${state.changeCount} | Updated: ${timeSinceUpdate}s ago`)
            }
            
            console.log("-".repeat(50))
            console.log(`Total Portfolio: ${totalBalance.toFixed(6)} WND`)
            console.log(`Timestamp: ${new Date().toLocaleString()}`)
        }, 30000) // Every 30 seconds
        
        // Keep the experiment running for demo purposes
        console.log("\n⏰ Real-time monitoring active...")
        console.log("   • Block updates will appear as they're finalized")
        console.log("   • Balance changes will be detected automatically")
        console.log("   • Portfolio summaries every 30 seconds")
        console.log("   • Press Ctrl+C to stop monitoring")
        
        // Cleanup function for graceful shutdown
        process.on('SIGINT', () => {
            console.log("\n\n🛑 Shutting down real-time monitoring...")
            
            clearInterval(summaryInterval)
            
            subscriptions.forEach(sub => {
                try {
                    sub.unsubscribe()
                } catch (error) {
                    console.log("Error unsubscribing:", error.message)
                }
            })
            
            console.log("✅ All subscriptions closed")
            console.log("📊 Final Portfolio State:")
            
            for (const [address, state] of portfolioState) {
                console.log(`   ${state.name}: ${state.currentBalance.toFixed(6)} WND (${state.changeCount} changes detected)`)
            }
            
            if (client) {
                client.destroy()
                console.log("🧹 Connection cleaned up")
            }
            
            console.log("\n🎉 Experiment 4 completed successfully!")
            console.log("✅ Real-time subscription patterns established")
            console.log("✅ Live balance monitoring working")
            console.log("✅ Reactive state management ready")
            console.log("✅ Perfect foundation for React integration")
            
            process.exit(0)
        })
        
        // Keep the process alive for monitoring
        await new Promise(() => {}) // This keeps the process running indefinitely
        
    } catch (error) {
        console.error("❌ Experiment 4 failed:", error.message)
        console.error("Full error:", error)
    } finally {
        // This won't run due to the infinite promise above, but it's good practice
        subscriptions.forEach(sub => {
            try {
                sub.unsubscribe()
            } catch (error) {
                console.log("Error in cleanup:", error.message)
            }
        })
        
        if (client) {
            client.destroy()
        }
    }
}

// Utility function to format balance changes
function formatBalanceChange(oldBalance, newBalance) {
    const change = newBalance - oldBalance
    const direction = change > 0 ? "📈" : "📉"
    const sign = change > 0 ? "+" : ""
    return `${direction} ${sign}${change.toFixed(6)} WND`
}

// Run experiment 4
console.log("🚀 Starting Real-time Portfolio Monitor...")
console.log("This experiment will run continuously until you press Ctrl+C")
experiment4()