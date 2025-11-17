# PolkaFlow Backend API Documentation

## 🚀 **Overview**
PolkaFlow Backend provides intelligent multi-chain Polkadot portfolio analysis and cross-chain fee optimization APIs. Built with modular architecture using WebSocket connections for optimal performance across 6 Westend ecosystem chains.

**⭐ Key Achievement: 88.94% fee savings through intelligent chain selection!**

## 🌐 **Base URL**
```
http://localhost:3001
```

## 📊 **API Endpoints**

### **Health & Info**

#### `GET /health`
Health check endpoint
```json
{
  "status": "healthy",
  "timestamp": "2025-11-17T17:55:56.703Z",
  "service": "PolkaFlow Backend",
  "version": "1.0.0"
}
```

#### `GET /api/v1`
API documentation and available endpoints
```json
{
  "message": "PolkaFlow API v1 - Multi-chain Portfolio & Fee Analysis",
  "endpoints": [
    "GET /health - Health check",
    "GET /api/v1 - API info",
    "--- Portfolio Analysis ---",
    "POST /api/v1/portfolio/analyze - Multi-chain portfolio analysis (MAIN ENDPOINT)",
    "POST /api/v1/portfolio/chain - Single chain portfolio analysis",
    "POST /api/v1/portfolio/validate-address - Validate Polkadot address format",
    "GET /api/v1/portfolio/supported-chains - Get list of supported chains",
    "GET /api/v1/portfolio/test-addresses - Get test addresses for development",
    "POST /api/v1/portfolio/cleanup - Cleanup connections (dev helper)",
    "--- Fee Analysis & Route Optimization (NEW!) ---",
    "POST /api/v1/fees/compare - Compare transfer fees across all chains (89% savings!)",
    "POST /api/v1/fees/optimal-route - Find cheapest route between chains",
    "GET /api/v1/fees/routes/:chainId - Get supported routes from a chain",
    "GET /api/v1/fees/supported-chains - Get chains supporting fee analysis",
    "GET /api/v1/fees/test-scenario - Demo fee savings scenario",
    "POST /api/v1/fees/cleanup - Cleanup fee analyzer connections"
  ]
}
```

---

## 📈 **Portfolio Analysis Endpoints**

### **`POST /api/v1/portfolio/analyze`** ⭐ **MAIN ENDPOINT**
Analyze address portfolio across all 6 supported chains (Complete Westend Ecosystem)

**Request Body:**
```json
{
  "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Portfolio analysis completed",
  "data": {
    "success": true,
    "summary": {
      "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      "totalChains": 6,
      "successfulChains": 6,
      "failedChains": 0,
      "totalBalance": "340671589506342",
      "totalBalanceFormatted": "340.6715",
      "analysisTime": 6545,
      "timestamp": "2025-11-17T17:39:23.818Z"
    },
    "chains": [
      {
        "success": true,
        "chainId": "westend2",
        "chainName": "Westend Relay",
        "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        "portfolio": {
          "exists": true,
          "freeBalance": "16464086198",
          "reservedBalance": "199532850000000",
          "totalBalance": "199549314086198",
          "nonce": 892,
          "formatted": {
            "freeBalance": "0.0164",
            "reservedBalance": "199.5328",
            "totalBalance": "199.5493",
            "tokenSymbol": "WND"
          }
        },
        "analysisTime": 4586,
        "timestamp": "2025-11-17T17:39:21.859Z"
      },
      {
        "success": true,
        "chainId": "westend2_asset_hub",
        "chainName": "Asset Hub",
        "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        "portfolio": {
          "exists": true,
          "freeBalance": "20644470931480",
          "reservedBalance": "120456429000000",
          "totalBalance": "141100899931480",
          "nonce": 402,
          "formatted": {
            "freeBalance": "20.6444",
            "reservedBalance": "120.4564",
            "totalBalance": "141.1008",
            "tokenSymbol": "WND"
          }
        },
        "analysisTime": 4908,
        "timestamp": "2025-11-17T17:39:22.396Z"
      },
      {
        "success": true,
        "chainId": "westend2_bridge_hub",
        "chainName": "Bridge Hub",
        "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        "portfolio": {
          "exists": true,
          "freeBalance": "0",
          "reservedBalance": "0",
          "totalBalance": "0",
          "nonce": 0,
          "formatted": {
            "freeBalance": "0.0000",
            "reservedBalance": "0.0000",
            "totalBalance": "0.0000",
            "tokenSymbol": "WND"
          }
        },
        "analysisTime": 5139,
        "timestamp": "2025-11-17T17:39:22.634Z"
      },
      {
        "success": true,
        "chainId": "westend2_people",
        "chainName": "People Chain",
        "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        "portfolio": {
          "exists": true,
          "freeBalance": "1282488664",
          "reservedBalance": "20093000000",
          "totalBalance": "21375488664",
          "nonce": 65,
          "formatted": {
            "freeBalance": "0.0013",
            "reservedBalance": "0.0201",
            "totalBalance": "0.0214",
            "tokenSymbol": "WND"
          }
        },
        "analysisTime": 4951,
        "timestamp": "2025-11-17T17:39:22.470Z"
      }
    ]
  }
}
```

---

### **`POST /api/v1/portfolio/chain`**
Analyze portfolio on a specific chain

**Request Body:**
```json
{
  "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
  "chainId": "westend2_asset_hub"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "westend2_asset_hub portfolio analysis completed",
  "data": {
    "success": true,
    "chainId": "westend2_asset_hub",
    "chainName": "Asset Hub",
    "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "portfolio": {
      "exists": true,
      "freeBalance": "20644470931480",
      "reservedBalance": "120456429000000",
      "totalBalance": "141100899931480",
      "nonce": 402,
      "formatted": {
        "freeBalance": "20.6444",
        "reservedBalance": "120.4564",
        "totalBalance": "141.1008",
        "tokenSymbol": "WND"
      }
    },
    "analysisTime": 2341,
    "timestamp": "2025-11-17T15:40:12.123Z"
  }
}
```

---

## 💰 **Fee Analysis & Route Optimization Endpoints** ⭐ **NEW MVP FEATURE**

### **`POST /api/v1/fees/compare`** 🏆 **CORE SAVINGS FEATURE**
Compare transfer fees across all 6 chains to find optimal cost savings (88.94% proven savings!)

**Request Body:**
```json
{
  "amount": "1000000000000",
  "destinationAddress": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Cross-chain fee analysis completed",
  "data": {
    "amount": "1000000000000",
    "destinationAddress": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "totalChains": 6,
    "successfulChains": 6,
    "failedChains": 0,
    "fees": [
      {
        "success": true,
        "chainId": "westend2_asset_hub",
        "chainName": "Asset Hub",
        "fee": "1794193115",
        "feeFormatted": "0.001794",
        "tokenSymbol": "WND"
      },
      {
        "success": true,
        "chainId": "westend2",
        "chainName": "Westend Relay",
        "fee": "16227473774",
        "feeFormatted": "0.016227",
        "tokenSymbol": "WND"
      }
    ],
    "sortedByCheapest": [
      {
        "success": true,
        "chainId": "westend2_asset_hub",
        "chainName": "Asset Hub",
        "fee": "1794193115",
        "feeFormatted": "0.001794",
        "tokenSymbol": "WND"
      }
    ],
    "savings": {
      "cheapest": "Asset Hub",
      "mostExpensive": "Westend Relay", 
      "savingsAmount": "14433280659",
      "savingsPercent": "88.94%",
      "absoluteSavings": "0.014433"
    },
    "analysisTime": 5879,
    "timestamp": "2025-11-17T17:55:56.703Z"
  }
}
```

---

### **`POST /api/v1/fees/optimal-route`**
Find optimal routing path between chains for minimum cost transfers

**Request Body:**
```json
{
  "fromChain": "westend2",
  "toChain": "westend2_asset_hub",
  "amount": "1000000000000"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Optimal route analysis completed",
  "data": {
    "fromChain": "westend2",
    "toChain": "westend2_asset_hub", 
    "amount": "1000000000000",
    "totalRoutes": 3,
    "optimalRoute": {
      "type": "direct",
      "path": ["westend2", "westend2_asset_hub"],
      "hops": 1,
      "routeType": "relay_to_parachain",
      "estimatedFee": {
        "success": true,
        "totalFee": "50000000000",
        "totalFeeFormatted": "0.050000",
        "tokenSymbol": "WND"
      }
    },
    "recommendation": "Use relay_to_parachain route with 1 hop(s)",
    "timestamp": "2025-11-17T18:00:00.000Z"
  }
}
```

---

### **`GET /api/v1/fees/routes/:chainId`**
Get all supported XCM routes from a specific chain

**Example: `GET /api/v1/fees/routes/westend2`**

**Response:**
```json
{
  "success": true,
  "message": "Routes for westend2 retrieved",
  "data": {
    "fromChain": "westend2",
    "fromChainName": "Westend Relay",
    "totalRoutes": 5,
    "routes": [
      {
        "toChain": "westend2_asset_hub",
        "toChainName": "Asset Hub",
        "hops": 1,
        "routeType": "relay_to_parachain"
      },
      {
        "toChain": "westend2_bridge_hub", 
        "toChainName": "Bridge Hub",
        "hops": 1,
        "routeType": "relay_to_parachain"
      }
    ]
  }
}
```

---

### **`GET /api/v1/fees/supported-chains`**
Get all chains that support fee analysis with metadata

**Response:**
```json
{
  "success": true,
  "message": "6 chains support fee analysis",
  "data": {
    "totalChains": 6,
    "chains": [
      {
        "chainId": "westend2",
        "name": "Westend Relay",
        "icon": "🔗",
        "type": "relay",
        "tokenSymbol": "WND",
        "decimals": 12,
        "priority": 1
      },
      {
        "chainId": "westend2_asset_hub",
        "name": "Asset Hub", 
        "icon": "💎",
        "type": "system_parachain",
        "tokenSymbol": "WND",
        "decimals": 12,
        "priority": 1
      }
    ]
  }
}
```

---

### **`GET /api/v1/fees/test-scenario`** 🎭 **HACKATHON DEMO**
Instant demo endpoint showcasing fee savings (perfect for presentations!)

**Response:**
```json
{
  "success": true,
  "message": "Demo fee comparison completed - showcasing potential savings!",
  "data": {
    "amount": "1000000000000",
    "totalChains": 6,
    "successfulChains": 6,
    "savings": {
      "cheapest": "Asset Hub",
      "mostExpensive": "Westend Relay",
      "savingsPercent": "88.94%"
    },
    "demoInfo": {
      "scenario": "Transfer 1 WND to Alice's address across all Westend chains",
      "testAddress": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      "testAmount": "1000000000000",
      "amountFormatted": "1.0000 WND",
      "purpose": "Demonstrate cross-chain fee savings (based on experiment 6 proving 89% savings possible)"
    }
  }
}
```

---

## 🔧 **Utility Endpoints**

### **`POST /api/v1/portfolio/validate-address`**
Validate Polkadot address format before analysis

**Request Body:**
```json
{
  "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    "valid": true,
    "error": null
  }
}
```

---

### **`GET /api/v1/portfolio/supported-chains`**
Get list of all 6 supported chains with metadata

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "chainId": "westend2",
      "name": "Westend Relay",
      "icon": "🔗",
      "type": "relay",
      "description": "Westend relay chain for testing and governance",
      "priority": 1,
      "tokenSymbol": "WND"
    },
    {
      "chainId": "westend2_asset_hub",
      "name": "Asset Hub",
      "icon": "💎",
      "type": "system_parachain",
      "description": "Asset management and native token operations",
      "priority": 1,
      "tokenSymbol": "WND"
    },
    {
      "chainId": "westend2_bridge_hub",
      "name": "Bridge Hub",
      "icon": "🌉",
      "type": "system_parachain",
      "description": "Cross-chain bridge operations",
      "priority": 2,
      "tokenSymbol": "WND"
    },
    {
      "chainId": "westend2_collectives",
      "name": "Collectives",
      "icon": "🏛️",
      "type": "system_parachain",
      "description": "Governance collectives and fellowship operations",
      "priority": 1,
      "tokenSymbol": "WND"
    },
    {
      "chainId": "westend2_coretime",
      "name": "Coretime",
      "icon": "⏰",
      "type": "system_parachain",
      "description": "Coretime allocation and management for parachains",
      "priority": 2,
      "tokenSymbol": "WND"
    },
    {
      "chainId": "westend2_people",
      "name": "People Chain",
      "icon": "👥",
      "type": "system_parachain",
      "description": "Identity and reputation management",
      "priority": 2,
      "tokenSymbol": "WND"
    }
  ],
  "message": "6 chains supported"
}
```

---

### **`GET /api/v1/portfolio/test-addresses`**
Get well-known test addresses for development

**Response:**
```json
{
  "success": true,
  "message": "Test addresses for development",
  "data": {
    "alice": {
      "name": "Alice",
      "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
      "description": "Well-known test account with funding"
    },
    "bob": {
      "name": "Bob",
      "address": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
      "description": "Well-known test account for transfers"
    },
    "charlie": {
      "name": "Charlie",
      "address": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
      "description": "Well-known test account for multi-sig"
    }
  }
}
```

---

### **`POST /api/v1/portfolio/cleanup`**
Cleanup all connections (development helper)

**Response:**
```json
{
  "success": true,
  "message": "All portfolio connections cleaned up"
}
```

---

## 📡 **Supported Chains**

### **Complete Westend2 Ecosystem (6 Chains)**
| Chain | Type | Priority | Fee Range | Features |
|-------|------|----------|-----------|----------|
| **Westend Relay** 🔗 | Relay Chain | High | 0.016227 WND | Governance, staking, core functionality |
| **Asset Hub** 💎 | System Parachain | High | 0.001794 WND ⭐ | Asset management, token operations (CHEAPEST!) |
| **Bridge Hub** 🌉 | System Parachain | Medium | 0.002924 WND | Cross-chain bridges and ecosystem connections |
| **Collectives** 🏛️ | System Parachain | High | 0.002284 WND | Governance collectives and fellowship |
| **Coretime** ⏰ | System Parachain | Medium | 0.002808 WND | Coretime allocation and parachain management |
| **People Chain** 👥 | System Parachain | Medium | 0.002808 WND | Identity management and reputation |

**💡 Key Insight: Asset Hub offers 88.94% savings compared to Westend Relay!**

---

## ⚡ **Performance**

### **Multi-Chain Analysis:**
- **Parallel Processing**: All 6 chains queried simultaneously
- **Timeout Protection**: 15-second timeout per chain
- **WebSocket Connections**: Fast, direct RPC connections
- **Typical Response Time**: 5-7 seconds for 6 chains
- **Fee Analysis**: Real-time comparison across complete ecosystem

### **Cost Optimization:**
- **88.94% Maximum Savings**: Asset Hub vs Westend Relay
- **Intelligent Routing**: Multi-hop XCM path optimization
- **Live Fee Comparison**: Real-time analysis across all chains
- **Smart Recommendations**: Automatic cheapest chain selection

### **Connection Details:**
- **Westend Relay**: `wss://westend-rpc.polkadot.io`
- **Asset Hub**: `wss://westend-asset-hub-rpc.polkadot.io`  
- **Bridge Hub**: `wss://westend-bridge-hub-rpc.polkadot.io`
- **Collectives**: `wss://westend-collectives-rpc.polkadot.io`
- **Coretime**: `wss://westend-coretime-rpc.polkadot.io`
- **People Chain**: `wss://westend-people-rpc.polkadot.io`
- **Technology**: Polkadot API (PAPI) v1.20+ with WebSocket providers

---

## 🛠️ **Error Handling**

### **Common Error Responses:**

**Invalid Address:**
```json
{
  "success": false,
  "error": "Invalid address format",
  "message": "Address must start with 5 for Westend format"
}
```

**Connection Timeout:**
```json
{
  "success": false,
  "message": "Portfolio analysis failed",
  "data": {
    "success": false,
    "summary": {
      "successfulChains": 1,
      "failedChains": 1
    },
    "chains": [
      {
        "success": false,
        "chainId": "westend2_asset_hub",
        "error": "Asset Hub connection timeout"
      }
    ]
  }
}
```

---

## 🎯 **Frontend Integration**

### **Primary Use Cases:**

#### **1. Portfolio Analysis:**
1. **User enters address** in frontend form
2. **Call** `POST /api/v1/portfolio/analyze`
3. **Display** total portfolio across 6 chains + individual breakdowns
4. **Show** balance distribution and chain-specific details

#### **2. Fee Optimization (MVP Core Feature):**
1. **User initiates transfer** with amount and destination
2. **Call** `POST /api/v1/fees/compare` 
3. **Display** fee comparison across all 6 chains
4. **Highlight** 88.94% potential savings with Asset Hub
5. **User selects** optimal chain for transaction

#### **3. Route Planning:**
1. **User selects** source and destination chains
2. **Call** `POST /api/v1/fees/optimal-route`
3. **Display** direct vs multi-hop routing options
4. **Show** estimated costs** for each route

### **Demo Features:**
- **Instant demo**: `GET /api/v1/fees/test-scenario` for presentations
- **Test addresses** with real balances (Alice, Bob, Charlie)
- **Live fee data** from Westend testnet
- **Real 88.94% savings** demonstration

---

## 📋 **Development Notes**

### **Architecture:**
- **Modular Design**: Separate services per chain (`westend2.js`, `assetHub.js`)
- **Centralized Config**: All chain metadata in `/src/config/chains.js`
- **Clean Error Handling**: Graceful degradation, partial results on failures
- **TypeScript Ready**: Structured responses for easy frontend integration

### **Architecture Highlights:**
- **Modular Chain Services**: Each chain (westend2.js, assetHub.js, etc.) with consistent API
- **Centralized Configuration**: All chain metadata in `/src/config/chains.js`  
- **Cross-Chain Fee Engine**: Advanced fee comparison with XCM route optimization
- **Parallel Processing**: Simultaneous queries across all chains for speed
- **Production Error Handling**: Graceful degradation, partial results on failures

### **Adding New Chains:**
1. Add chain config to `CHAIN_CONFIG` in `/src/config/chains.js`
2. Create new service file following existing pattern (e.g., `newChain.js`)
3. Add to `multiChain.js` and `crossChainFees.js` registries  
4. Install descriptors: `npx papi add [chain_name] -n [chain_name]`
5. Update XCM routing matrix for cross-chain fee optimization

---

## 🎯 **MVP 1 Status**

**✅ COMPLETED FEATURES:**
- ✅ **6-Chain Portfolio Analysis** (340.67 WND total across ecosystem)
- ✅ **Cross-Chain Fee Comparison** (88.94% savings proven!)
- ✅ **Route Optimization** with XCM multi-hop support
- ✅ **Production APIs** ready for frontend integration
- ✅ **Real Testnet Data** from live Westend chains
- ✅ **Demo Endpoints** perfect for hackathon presentations

**🚀 READY FOR FRONTEND DEVELOPMENT!**

---

**Last Updated:** November 17, 2025  
**API Version:** 1.0.0 (MVP Complete)  
**Status:** ✅ Production Ready & Hackathon Demo Ready  
**Achievement:** 88.94% fee savings across 6-chain Westend ecosystem