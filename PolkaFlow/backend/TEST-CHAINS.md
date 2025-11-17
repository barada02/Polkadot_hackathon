# Chain Connection Service Test

## Test Individual Endpoint

You can test the chain connection service using these commands:

### 1. Start the Server
```bash
cd backend
npm start
```

### 2. Test the Endpoints

**Get Chain Status (GET request):**
```bash
curl -X GET "http://localhost:3001/api/v1/chains/status" -H "Content-Type: application/json"
```

**Test All Chain Connections (POST request):**
```bash
curl -X POST "http://localhost:3001/api/v1/chains/test" -H "Content-Type: application/json"
```

**Test Specific Chain (POST request):**
```bash
curl -X POST "http://localhost:3001/api/v1/chains/test/westend" -H "Content-Type: application/json"
curl -X POST "http://localhost:3001/api/v1/chains/test/assethub" -H "Content-Type: application/json"
```

**Get Chain Info (GET request):**
```bash
curl -X GET "http://localhost:3001/api/v1/chains/westend" -H "Content-Type: application/json"
```

**Reset Connections (POST request):**
```bash
curl -X POST "http://localhost:3001/api/v1/chains/reset" -H "Content-Type: application/json"
```

### 3. Expected Responses

**Chain Status Response:**
```json
{
  "success": true,
  "data": {
    "westend": {
      "name": "Westend Relay",
      "icon": "🔗",
      "type": "relay",
      "connected": false,
      "health": 0,
      "lastConnected": null,
      "endpoint": "wss://westend-rpc.polkadot.io",
      "retryCount": 0
    },
    // ... more chains
  },
  "timestamp": "2024-01-XX..."
}
```

**Test All Chains Response:**
```json
{
  "success": true,
  "data": {
    "timestamp": "2024-01-XX...",
    "totalChains": 4,
    "connectedChains": 3,
    "failedChains": 1,
    "averageHealth": 78,
    "results": [
      {
        "success": true,
        "chainId": "westend",
        "name": "Westend Relay",
        "health": 85,
        "connectionTime": 450,
        "endpoint": "wss://westend-rpc.polkadot.io"
      }
      // ... more results
    ]
  },
  "summary": {
    "totalChains": 4,
    "connectedChains": 3,
    "averageHealth": 78,
    "timestamp": "2024-01-XX..."
  }
}
```

## What This Service Does

✅ **Simulates Multi-Chain Connections** - Based on our successful experiments  
✅ **Health Score Monitoring** - Returns 50-90% health scores like ex7  
✅ **Retry Logic** - Handles connection failures gracefully  
✅ **Realistic Timing** - Simulates actual network delays and responses  
✅ **Chain Configuration** - Uses the proven chain setup from our experiments  

## Next Steps After Testing

1. Test these endpoints work correctly
2. Create fee comparison service (integrating ex6 89% savings logic)  
3. Create portfolio analysis service
4. Add PAPI integration to replace simulation
5. Connect to frontend