# PolkaFlow Backend API Documentation

## 🚀 **Overview**
PolkaFlow Backend provides intelligent multi-chain Polkadot portfolio analysis and management APIs. Built with modular architecture using WebSocket connections for optimal performance.

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
  "timestamp": "2025-11-17T15:33:08.561Z",
  "service": "PolkaFlow Backend",
  "version": "1.0.0"
}
```

#### `GET /api/v1`
API documentation and available endpoints
```json
{
  "message": "PolkaFlow API v1",
  "endpoints": [
    "POST /api/v1/portfolio/analyze - Multi-chain portfolio analysis (MAIN ENDPOINT)",
    "POST /api/v1/portfolio/chain - Single chain portfolio analysis",
    "POST /api/v1/portfolio/validate-address - Validate Polkadot address format",
    "GET /api/v1/portfolio/supported-chains - Get list of supported chains",
    "GET /api/v1/portfolio/test-addresses - Get test addresses for development",
    "POST /api/v1/portfolio/cleanup - Cleanup connections (dev helper)"
  ]
}
```

---

## 📈 **Portfolio Analysis Endpoints**

### **`POST /api/v1/portfolio/analyze`** ⭐ **MAIN ENDPOINT**
Analyze address portfolio across all supported chains (Westend2 Relay + Asset Hub)

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
      "totalChains": 2,
      "successfulChains": 2,
      "failedChains": 0,
      "totalBalance": "340650214017678",
      "totalBalanceFormatted": "340.6502",
      "analysisTime": 5178,
      "timestamp": "2025-11-17T15:33:08.561Z"
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
        "analysisTime": 4748,
        "timestamp": "2025-11-17T15:33:08.133Z"
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
        "analysisTime": 4848,
        "timestamp": "2025-11-17T15:33:08.561Z"
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
Get list of all supported chains with metadata

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
    }
  ],
  "message": "2 chains supported"
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

### **Current Ecosystem: Westend2**
| Chain | Type | Priority | Features |
|-------|------|----------|----------|
| **Westend Relay** 🔗 | Relay Chain | High | Governance, staking, core functionality |
| **Asset Hub** 💎 | System Parachain | High | Asset management, token operations |
| **Bridge Hub** 🌉 | System Parachain | Medium | Cross-chain bridges (future) |
| **People Chain** 👥 | System Parachain | Medium | Identity management (future) |

---

## ⚡ **Performance**

### **Multi-Chain Analysis:**
- **Parallel Processing**: All chains queried simultaneously
- **Timeout Protection**: 15-second timeout per chain
- **WebSocket Connections**: Fast, direct RPC connections
- **Typical Response Time**: 3-6 seconds for 2 chains

### **Connection Details:**
- **Westend Relay**: `wss://westend-rpc.polkadot.io`
- **Asset Hub**: `wss://westend-asset-hub-rpc.polkadot.io`
- **Technology**: Polkadot API (PAPI) v1.20.6 with WebSocket providers

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

### **Primary Use Case:**
1. **User enters address** in frontend form
2. **Call** `POST /api/v1/portfolio/analyze`
3. **Display** total portfolio + individual chain breakdowns
4. **Show** balance types (free vs reserved) for recommendations

### **Additional Features:**
- **Address validation** before submission
- **Supported chains** dropdown/selection
- **Individual chain** deep-dive analysis
- **Test addresses** for demo purposes

---

## 📋 **Development Notes**

### **Architecture:**
- **Modular Design**: Separate services per chain (`westend2.js`, `assetHub.js`)
- **Centralized Config**: All chain metadata in `/src/config/chains.js`
- **Clean Error Handling**: Graceful degradation, partial results on failures
- **TypeScript Ready**: Structured responses for easy frontend integration

### **Adding New Chains:**
1. Update `CHAIN_CONFIG` in `/src/config/chains.js`
2. Create new service file (e.g., `bridgeHub.js`)
3. Add to `multiChain.js` chains registry
4. Install chain descriptors with `npx papi add`

---

**Last Updated:** November 17, 2025  
**API Version:** 1.0.0  
**Status:** ✅ Production Ready