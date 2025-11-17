# JSON-RPC Providers

The Polkadot-API entry point is `createClient(provider)`. It takes a `JsonRpcProvider` that connects to a JSON-RPC endpoint, enabling Polkadot-API to interact with the chain.

## Providers

We have mainly two first-class providers:

- **Smoldot Provider**, connecting to a local instance of Smoldot, Polkadot's light client.
- **WebSocket Provider**, connecting to a JSON-RPC server through WebSocket.

## Enhancers

Besides providers, we offer some enhancers (aka middlewares) for JSON-RPC providers, some of them increasing capabilities, and others fixing external issues.

- **Polkadot-SDK Compatibility Enhancer**, fixing common pitfalls among JSON-RPC servers running over Polkadot-SDK nodes.
- **Legacy Provider**, a compliant middleware that exposes the modern JSON-RPC APIs while delegating calls to the legacy JSON-RPC APIs.
- **Logs Provider and Recorder**, allowing to capture JSON-RPC messaging logs, useful for debugging and/or analytics.

## JSON-RPC providers in-depth

For a description of the provider interface, behaviour and advanced use cases such as building your own providers, check out our [JSON-RPC Provider Interface Docs](https://github.com/polkadot-api/polkadot-api/blob/main/packages/json-rpc-provider-interface/README.md).