# Polkadot Playground - Experiments Roadmap

**Goal**: Learn Polkadot/PAPI step-by-step through hands-on experiments  
**Approach**: Pure Node.js scripts → Console output → Build confidence → Then create full project

---

## 🧪 **Experiment Progress**

### ✅ **Experiment 1: "Hello Polkadot"** (COMPLETED)
**File**: `ex1-connection.js`  
**Goal**: Basic PAPI connection and chain information  
**What it does**:
- Connects to Westend testnet
- Gets chain name and genesis hash
- Tests basic PAPI functionality
**Learning**: WebSocket connections, async operations, proper cleanup

---

### 🔄 **Experiment 2: "Show Me Balances"** (IN PROGRESS)
**File**: `ex2-balances.js`  
**Goal**: Query account balances from blockchain  
**What it does**:
- Connect to Polkadot network
- Query specific account balance
- Format balance from Planck to DOT
- Handle different account formats
**Learning**: Account queries, balance formatting, error handling

---

### 📋 **Experiment 3: "Multiple Accounts"** (PLANNED)
**File**: `ex3-multi-accounts.js`  
**Goal**: Query multiple accounts and compare balances  
**What it does**:
- Query balances for multiple accounts
- Display formatted results in table
- Calculate total holdings
**Learning**: Batch queries, data formatting, array operations

---

### 🔴 **Experiment 4: "Real-time Updates"** (PLANNED)
**File**: `ex4-realtime.js`  
**Goal**: Subscribe to live balance changes  
**What it does**:
- Subscribe to balance changes
- Log updates in real-time
- Handle subscription lifecycle
**Learning**: WebSocket subscriptions, observables, reactive data

---

### 🌐 **Experiment 5: "Multi-Chain Connections"** (PLANNED)
**File**: `ex5-multichains.js`  
**Goal**: Connect to multiple parachains simultaneously  
**What it does**:
- Connect to Westend + Asset Hub + Statemint
- Query balances from all chains
- Display unified cross-chain view
**Learning**: Multi-chain architecture, concurrent connections

---

### 💸 **Experiment 6: "Fee Comparison"** (PLANNED)
**File**: `ex6-fees.js`  
**Goal**: Compare transaction fees across parachains  
**What it does**:
- Estimate transfer fees on different chains
- Compare costs for same operation
- Recommend optimal chain
**Learning**: Fee estimation, transaction simulation, cost analysis

---

### 🏥 **Experiment 7: "Network Health Monitor"** (PLANNED)
**File**: `ex7-health.js`  
**Goal**: Monitor parachain network status  
**What it does**:
- Check block production rates
- Monitor network connectivity
- Display health indicators
**Learning**: Network monitoring, health metrics, status indicators

---

## 📊 **Experiment Timeline**

**Session 1 (Today)**:
- ✅ Experiment 1: Basic connection
- 🔄 Experiment 2: Balance queries
- 📋 Experiment 3: Multiple accounts

**Session 2**:
- 🔴 Experiment 4: Real-time updates
- 🌐 Experiment 5: Multi-chain connections

**Session 3**:
- 💸 Experiment 6: Fee comparison
- 🏥 Experiment 7: Network health

---

## 🎯 **Key Learning Objectives**

### **Technical Skills**:
- PAPI connection management
- Account and balance handling
- WebSocket subscriptions
- Multi-chain coordination
- Error handling patterns
- Async JavaScript proficiency

### **Polkadot Concepts**:
- Network architecture (Relay + Parachains)
- Account systems and addresses
- Cross-chain messaging (XCM)
- Transaction fees and optimization
- Network health and monitoring

### **Development Patterns**:
- Clean connection lifecycle
- Proper async/await usage
- Error handling strategies
- Data formatting and display
- Resource cleanup

---

## 📁 **File Organization**

```
polkadot-playground/
├── experiments-roadmap.md          # This file
├── ex1-connection.js              # ✅ Basic connection
├── ex2-balances.js                # 🔄 Balance queries  
├── ex3-multi-accounts.js          # 📋 Multiple accounts
├── ex4-realtime.js                # 🔴 Real-time updates
├── ex5-multichains.js             # 🌐 Multi-chain connections
├── ex6-fees.js                    # 💸 Fee comparison
├── ex7-health.js                  # 🏥 Network health
├── utils.js                       # Shared helper functions
├── package.json                   # Dependencies
└── node_modules/                  # Installed packages
```

---

## 🚀 **Next Steps**

1. **Complete Experiment 2** - Balance queries working
2. **Run and understand each experiment** - Build confidence
3. **Modify and experiment** - Try different accounts, networks
4. **Document learnings** - Note patterns and gotchas
5. **Move to full project** - Apply learnings to React app

---

## 🎓 **Success Criteria**

After completing all experiments, you should be able to:
- ✅ Connect to any Polkadot network confidently
- ✅ Query account data and balances reliably  
- ✅ Handle real-time blockchain updates
- ✅ Work with multiple parachains simultaneously
- ✅ Understand Polkadot's "mall" architecture practically
- ✅ Build your hackathon project with confidence

**Each experiment builds on the previous one - start simple, get complex!**