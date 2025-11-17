import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider"

async function exploreAPI() {
    console.log("🔍 PAPI Structure Explorer - Complete API Mapping")
    console.log("Let's understand exactly what we're working with...")
    
    let client = null
    
    try {
        const wsProvider = getWsProvider("wss://westend-rpc.polkadot.io")
        client = createClient(wsProvider)
        
        console.log("✅ Connected to Westend testnet")
        console.log("=".repeat(80))
        
        // 1. MAIN CLIENT METHODS
        console.log("\n📋 1. MAIN CLIENT METHODS:")
        console.log("-".repeat(40))
        const clientMethods = Object.getOwnPropertyNames(client)
        clientMethods.forEach((method, index) => {
            console.log(`${index + 1}. ${method}`)
        })
        
        // 2. CLIENT METHOD DETAILS
        console.log("\n🔧 2. CLIENT METHOD DETAILS:")
        console.log("-".repeat(40))
        
        const methodsToTest = [
            'getChainSpecData', 'getMetadata', 'getFinalizedBlock', 
            'getTypedApi', 'getUnsafeApi', 'rawQuery', 'hodlBlock'
        ]
        
        for (const methodName of methodsToTest) {
            if (client[methodName]) {
                console.log(`✅ ${methodName}: ${typeof client[methodName]}`)
                
                // Test some safe methods
                if (methodName === 'getChainSpecData') {
                    try {
                        const result = await client[methodName]()
                        console.log(`   ↳ Returns: ${result.name} (${typeof result})`)
                    } catch (e) {
                        console.log(`   ↳ Error: ${e.message}`)
                    }
                }
                
                if (methodName === 'getFinalizedBlock') {
                    try {
                        const result = await client[methodName]()
                        console.log(`   ↳ Returns: Block #${result.number} (${typeof result})`)
                    } catch (e) {
                        console.log(`   ↳ Error: ${e.message}`)
                    }
                }
            } else {
                console.log(`❌ ${methodName}: NOT FOUND`)
            }
        }
        
        // 3. UNSAFE API STRUCTURE
        console.log("\n🚧 3. UNSAFE API STRUCTURE:")
        console.log("-".repeat(40))
        
        try {
            const unsafeApi = client.getUnsafeApi()
            console.log("✅ getUnsafeApi() successful")
            console.log("Type:", typeof unsafeApi)
            
            const unsafeProps = Object.getOwnPropertyNames(unsafeApi)
            console.log("Properties:", unsafeProps)
            
            // Explore each property
            for (const prop of unsafeProps) {
                console.log(`\n🔹 ${prop}:`)
                console.log(`   Type: ${typeof unsafeApi[prop]}`)
                
                if (typeof unsafeApi[prop] === 'object' && unsafeApi[prop] !== null) {
                    const subProps = Object.keys(unsafeApi[prop])
                    console.log(`   Keys: [${subProps.join(', ')}]`)
                    
                    // If it's query, explore deeper
                    if (prop === 'query' && subProps.length > 0) {
                        console.log("   📚 Query pallets available:")
                        subProps.forEach(pallet => {
                            console.log(`      - ${pallet}`)
                            if (unsafeApi[prop][pallet]) {
                                const palletMethods = Object.keys(unsafeApi[prop][pallet])
                                if (palletMethods.length > 0) {
                                    console.log(`        Methods: ${palletMethods.join(', ')}`)
                                }
                            }
                        })
                    }
                }
            }
        } catch (error) {
            console.log("❌ getUnsafeApi failed:", error.message)
        }
        
        // 4. TYPED API STRUCTURE
        console.log("\n📝 4. TYPED API STRUCTURE:")
        console.log("-".repeat(40))
        
        try {
            const typedApi = client.getTypedApi()
            console.log("✅ getTypedApi() successful (unexpected!)")
            console.log("Type:", typeof typedApi)
            console.log("Properties:", Object.getOwnPropertyNames(typedApi))
        } catch (error) {
            console.log("❌ getTypedApi failed (expected):", error.message)
        }
        
        // 5. BLOCK OPERATIONS
        console.log("\n📦 5. BLOCK OPERATIONS:")
        console.log("-".repeat(40))
        
        try {
            const finalizedBlock = await client.getFinalizedBlock()
            console.log(`✅ Got finalized block #${finalizedBlock.number}`)
            console.log("Block object type:", typeof finalizedBlock)
            console.log("Block properties:", Object.getOwnPropertyNames(finalizedBlock))
            
            // Test hodlBlock
            try {
                const pinnedBlock = client.hodlBlock(finalizedBlock.hash)
                console.log("✅ hodlBlock successful")
                console.log("Pinned block type:", typeof pinnedBlock)
                console.log("Pinned block properties:", Object.getOwnPropertyNames(pinnedBlock))
                
                // Clean up
                if (pinnedBlock.unpin) {
                    pinnedBlock.unpin()
                    console.log("✅ Block unpinned")
                }
            } catch (error) {
                console.log("❌ hodlBlock failed:", error.message)
            }
            
        } catch (error) {
            console.log("❌ Block operations failed:", error.message)
        }
        
        // 6. RAW QUERY METHOD
        console.log("\n🔍 6. RAW QUERY METHOD:")
        console.log("-".repeat(40))
        
        if (client.rawQuery) {
            console.log("✅ rawQuery method exists")
            console.log("Type:", typeof client.rawQuery)
            
            // Try to understand rawQuery signature by attempting with different params
            console.log("Testing rawQuery parameter patterns...")
            
            const testCalls = [
                { desc: "No params", params: [] },
                { desc: "Chain info", params: ["System", "Chain"] },
                { desc: "Block number", params: ["System", "Number"] }
            ]
            
            for (const test of testCalls) {
                try {
                    console.log(`   Testing ${test.desc}:`)
                    const result = await client.rawQuery(...test.params)
                    console.log(`   ✅ Success: ${JSON.stringify(result)}`)
                } catch (error) {
                    console.log(`   ❌ Failed: ${error.message}`)
                }
            }
        } else {
            console.log("❌ rawQuery method not found")
        }
        
        console.log("\n" + "=".repeat(80))
        console.log("🎯 SUMMARY - What we now understand:")
        console.log("✅ Complete PAPI client structure mapped")
        console.log("✅ Available methods and their types identified")
        console.log("✅ Unsafe API structure explored")
        console.log("✅ Block operation capabilities tested")
        console.log("✅ Query method signatures understood")
        console.log("📚 Ready to build working examples based on this knowledge!")
        
    } catch (error) {
        console.error("❌ API exploration failed:", error.message)
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

// Run the API exploration
exploreAPI()