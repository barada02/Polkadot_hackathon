// Quick test to see what chainspec names work
import { createClient } from "polkadot-api"
import { getWsProvider } from "polkadot-api/ws-provider/web"
import { withPolkadotSdkCompat } from "polkadot-api/polkadot-sdk-compat"
import { westend2 } from "@polkadot-api/descriptors"

console.log("Testing chainspec names...")

const testChainspecs = [
  "westend2",
  "westend",
  "westend_testnet",
  "-n westend2"
]

for (const chainspec of testChainspecs) {
  try {
    console.log(`\nTesting: "${chainspec}"`)
    const provider = getWsProvider(chainspec)
    console.log(`✅ Provider created for: ${chainspec}`)
    
    const enhancedProvider = withPolkadotSdkCompat(provider)
    const client = createClient(enhancedProvider)
    const api = client.getTypedApi(westend2)
    
    console.log(`✅ Client created for: ${chainspec}`)
    
    // Test connection with a quick timeout
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 5000)
    )
    
    try {
      await Promise.race([
        client.getFinalizedBlock(),
        timeout
      ])
      console.log(`✅ Connection successful for: ${chainspec}`)
      break
    } catch (error) {
      console.log(`❌ Connection failed for: ${chainspec} - ${error.message}`)
    }
    
  } catch (error) {
    console.log(`❌ Failed to create provider for: ${chainspec} - ${error.message}`)
  }
}

console.log("Test complete!")