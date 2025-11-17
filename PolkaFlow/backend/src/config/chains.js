// Chain Configuration - Based on our successful experiments
export const CHAIN_CONFIG = {
  westend: {
    name: "Westend Relay",
    icon: "🔗",
    type: "relay",
    endpoints: [
      "wss://westend-rpc.polkadot.io",
      "wss://westend-rpc.dwellir.com"
    ],
    // descriptor: westend2 - Will be imported when we add PAPI
    priority: 1
  },
  assethub: {
    name: "Asset Hub", 
    icon: "💎",
    type: "system_parachain",
    endpoints: [
      "wss://westend-asset-hub-rpc.polkadot.io/public-ws"
    ],
    // descriptor: westend2_asset_hub - Will be imported when we add PAPI
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
    // descriptor: westend2_bridge_hub - Will be imported when we add PAPI
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
    // descriptor: westend2_people - Will be imported when we add PAPI
    priority: 2
  }
};

export const TEST_ADDRESSES = {
  alice: {
    name: "Alice",
    address: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  },
  bob: {
    name: "Bob", 
    address: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
  },
  charlie: {
    name: "Charlie",
    address: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y"
  }
};