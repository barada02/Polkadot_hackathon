# PolkaFlow API Endpoint Plan

## Frontend User Journey & Required Endpoints

### 1. Address Portfolio Analysis
**User Action:** Enter address in frontend form
**Endpoint:** `POST /api/v1/portfolio/analyze`
**Payload:** `{ "address": "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY" }`
**Response:** Portfolio data across all Westend2 chains

### 2. Chain Fee Comparison  
**User Action:** Select chains to compare fees
**Endpoint:** `POST /api/v1/fees/compare`
**Payload:** `{ "address": "5Gr...", "chains": ["westend2", "westend2_asset_hub"], "amount": "1000000000000" }`
**Response:** Fee comparison with 89% savings calculation

### 3. Multi-Chain Connection Status
**User Action:** Dashboard shows chain health
**Endpoint:** `GET /api/v1/chains/multi-status`
**Response:** All chain connections with health scores

### 4. Single Chain Portfolio
**User Action:** Click on specific chain
**Endpoint:** `POST /api/v1/portfolio/chain`
**Payload:** `{ "address": "5Gr...", "chainId": "westend2_asset_hub" }`
**Response:** Portfolio data for that specific chain

### 5. Transaction Recommendations
**User Action:** Get best chain for operation
**Endpoint:** `POST /api/v1/recommendations/best-chain`
**Payload:** `{ "address": "5Gr...", "operation": "transfer", "amount": "1000000000000" }`
**Response:** Recommended chain with cost analysis

## Implementation Priority:
1. ✅ Real connection (done)
2. 🔄 Portfolio analysis (current)  
3. ⏳ Fee comparison
4. ⏳ Recommendations
5. ⏳ Multi-chain status