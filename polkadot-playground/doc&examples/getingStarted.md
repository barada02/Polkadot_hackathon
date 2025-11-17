# Getting Started with Polkadot-API

## Installation and Setup

Start by installing polkadot-api, and download the latest metadata from the chain you want to connect to and generate the types:

```bash
npm i polkadot-api
 
# `papi add` is the command
# `dot` is the name we're giving to this chain (can be any JS variable name)
# `-n polkadot` specifies to download the metadata from the well-known chain polkadot
npx papi add dot -n polkadot
# Wait for the latest metadata to download, then generate the types:
npx papi
```

It's a really good idea to add `papi` to the "postinstall" script in `package.json` to automate generating the types after installation.

## 1. Create the provider and Start the client

### Smoldot Provider

```typescript
// `dot` is the name we gave to `npx papi add`
import { dot } from "@polkadot-api/descriptors"
import { createClient } from "polkadot-api"
import { getSmProvider } from "polkadot-api/sm-provider"
import { chainSpec } from "polkadot-api/chains/polkadot"
import { start } from "polkadot-api/smoldot"
 
// if interested, check out how to create a smoldot instance in a WebWorker
// http://papi.how/providers/sm#webworker
const smoldot = start()
const chain = await smoldot.addChain({ chainSpec })
 
// Connect to the polkadot relay chain.
const client = createClient(getSmProvider(chain))
```

## 2. Start consuming the client!

```typescript
// With the `client`, you can get information such as subscribing to the last
// block to get the latest hash:
client.finalizedBlock$.subscribe((finalizedBlock) =>
  console.log(finalizedBlock.number, finalizedBlock.hash),
)
 
// To interact with the chain, you need to get the `TypedApi`, which includes
// all the types for every call in that chain:
const dotApi = client.getTypedApi(dot)
 
// get the value for an account
const accountInfo = await dotApi.query.System.Account.getValue(
  "16JGzEsi8gcySKjpmxHVrkLTHdFHodRepEz8n244gNZpr9J",
)
```

## 3. Discover our documentation!

To continue learning about PAPI, we recommend reading about:

- **[CLI & Codegen](https://papi.how/cli)**. Fully grasp how to generate descriptors, and why does it matter for PAPI.
- **[Providers](https://papi.how/providers)**. Discover all options that our providers offer! You'll need a provider to proceed with the client.
- **[Client](https://papi.how/client)**. Get information for blocks, metadata, etc. Essentially, everything generic that does not depend on the runtime itself. For runtime specifics, keep reading...
- **[Typed API](https://papi.how/typed)**. The cherry on top of the cake! Interact with the network: transactions, storage entries, runtime apis, and others!
- **[Signers](https://papi.how/signers)**. You'll find here how PAPI abstracts away signers, and how can be used to sign transactions!