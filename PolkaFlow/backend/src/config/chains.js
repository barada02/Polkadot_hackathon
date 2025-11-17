// Chain Configuration - Centralized config for good code practice
export const CHAIN_CONFIG = {
  westend2: {
    id: "westend2",
    name: "Westend Relay",
    icon: "🔗",
    type: "relay",
    wsEndpoint: "wss://westend-rpc.polkadot.io",
    descriptorName: "westend2",
    tokenSymbol: "WND",
    decimals: 12,
    priority: 1,
    description: "Westend relay chain for testing and governance"
  },
  westend2_asset_hub: {
    id: "westend2_asset_hub", 
    name: "Asset Hub",
    icon: "💎",
    type: "system_parachain",
    wsEndpoint: "wss://westend-asset-hub-rpc.polkadot.io",
    descriptorName: "westend2_asset_hub",
    tokenSymbol: "WND",
    decimals: 12,
    priority: 1,
    description: "Asset management and native token operations"
  },
  westend2_bridge_hub: {
    id: "westend2_bridge_hub",
    name: "Bridge Hub",
    icon: "🌉",
    type: "system_parachain",
    wsEndpoint: "wss://westend-bridge-hub-rpc.polkadot.io",
    descriptorName: "westend2_bridge_hub", 
    tokenSymbol: "WND",
    decimals: 12,
    priority: 2,
    description: "Cross-chain bridge operations"
  },
  westend2_people: {
    id: "westend2_people",
    name: "People Chain", 
    icon: "👥",
    type: "system_parachain",
    wsEndpoint: "wss://westend-people-rpc.polkadot.io",
    descriptorName: "westend2_people",
    tokenSymbol: "WND", 
    decimals: 12,
    priority: 2,
    description: "Identity and reputation management"
  },
  westend2_collectives: {
    id: "westend2_collectives",
    name: "Collectives",
    icon: "🏛️",
    type: "system_parachain",
    wsEndpoint: "wss://westend-collectives-rpc.polkadot.io",
    descriptorName: "westend2_collectives",
    tokenSymbol: "WND",
    decimals: 12,
    priority: 1,
    description: "Governance collectives and fellowship operations"
  },
  westend2_coretime: {
    id: "westend2_coretime",
    name: "Coretime",
    icon: "⏰",
    type: "system_parachain",
    wsEndpoint: "wss://westend-coretime-rpc.polkadot.io",
    descriptorName: "westend2_coretime",
    tokenSymbol: "WND",
    decimals: 12,
    priority: 2,
    description: "Coretime allocation and management for parachains"
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