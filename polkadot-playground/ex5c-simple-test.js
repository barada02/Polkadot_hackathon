/*
🌐 EXPERIMENT 5C-SIMPLE: Minimal Ecosystem Test
==============================================

Test just the chains we know work from ex5b
*/

import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { westend2, westend2_asset_hub } from "@polkadot-api/descriptors"

const SIMPLE_ECOSYSTEM = {
  westend: {
    name: "Westend Relay",
    icon: "🔗",
    endpoints: [
      "wss://westend-rpc.polkadot.io",
      "wss://westend-rpc.dwellir.com"
    ],
    descriptor: westend2
  },
  assethub: {
    name: "Asset Hub", 
    icon: "💎",
    endpoints: [
      "wss://westend-asset-hub-rpc.polkadot.io/public-ws"
    ],
    descriptor: westend2_asset_hub
  }
}

async function testSimpleEcosystem() {
  console.log("🌐 Testing Simple Ecosystem (2 chains)")
  console.log("=====================================")
  
  const clients = new Map()
  const apis = new Map()
  const status = new Map()
  
  // Initialize connections
  for (const [key, config] of Object.entries(SIMPLE_ECOSYSTEM)) {
    console.log(`${config.icon} Connecting to ${config.name}...`)
    
    try {
      const provider = getWsProvider(config.endpoints)
      const enhancedProvider = withPolkadotSdkCompat(provider)
      const client = createClient(enhancedProvider)
      const api = client.getTypedApi(config.descriptor)
      
      clients.set(key, client)
      apis.set(key, api)
      status.set(key, "CONNECTING")
      
      // Test connection
      const finalizedBlock = await client.getFinalizedBlock()
      console.log(`${config.icon} ${config.name}: ✅ Connected! Block #${finalizedBlock.number}`)
      status.set(key, "CONNECTED")
      
    } catch (error) {
      console.log(`${config.icon} ${config.name}: ❌ Failed - ${error.message}`)
      status.set(key, "FAILED")
    }
  }
  
  // Test account balances 
  const testAddress = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"  // Bob
  
  console.log(`\n💼 Testing portfolio for Bob...`)
  
  for (const [key, config] of Object.entries(SIMPLE_ECOSYSTEM)) {
    if (status.get(key) === "CONNECTED") {
      try {
        const api = apis.get(key)
        const accountInfo = await api.query.System.Account.getValue(testAddress)
        const balance = accountInfo?.data?.free || 0n
        const balanceFormatted = (Number(balance) / 1e12).toFixed(6)
        console.log(`${config.icon} ${config.name}: ${balanceFormatted} WND`)
      } catch (error) {
        console.log(`${config.icon} ${config.name}: ❌ Query failed - ${error.message}`)
      }
    } else {
      console.log(`${config.icon} ${config.name}: ⚪ Not connected`)
    }
  }
  
  const connectedCount = Array.from(status.values()).filter(s => s === "CONNECTED").length
  console.log(`\n🎉 Result: ${connectedCount}/2 chains connected`)
  
  // Cleanup
  for (const client of clients.values()) {
    try {
      client.destroy()
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

testSimpleEcosystem().catch(console.error)