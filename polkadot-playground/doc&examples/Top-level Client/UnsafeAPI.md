# UnsafeApi

The UnsafeApi enables interaction with the chain easily to the same extend TypedApi does, but it does not requires any descriptors. It is an advanced method and should only be used if you really know what you are doing. In order to create it, you can still pass a descriptors' type to get the same type inference as in the typedApi, but the shape of the entries at runtime level is not guaranteed.

The UnsafeApi does not provide any compatibility checks protection as TypedApi does.

The UnsafeApi has the following structure:

```typescript
type UnsafeApi = {
  query: StorageApi
  tx: TxApi
  txFromCallData: TxFromBinary
  event: EvApi
  apis: RuntimeCallsApi
  constants: ConstApi
  runtimeToken: Promise<RuntimeToken>
}
```

In order to create the unsafe api, it is actually very straightforward:

```typescript
const unsafeApi = client.getUnsafeApi() // without typings
 
// optionally generate descriptors to get type inference
import { dot } from "@polkadot-api/descriptors"
const unsafeApi = client.getUnsafeApi() // with typings
```

One can notice the API is actually very similar to the TypedApi, check its docs for the API reference since it behaves the exact same way. The only difference is that interactions do not include compatibility methods, and any reference to compatibilityToken in the typedApi is here a runtimeToken. For example:

```typescript
const typedApi = client.getTypedApi(descriptors)
const unsafeApi = client.getUnsafeApi()
 
// in typed is `compatibilityToken`
const typedToken = await typedApi.compatibilityToken
// in unsafe is `runtimeToken`
const unsafeToken = await unsafeApi.runtimeToken
 
// typed version
typedApi.consts.System.SS58Prefix(typedToken)
 
// unsafe
unsafeApi.consts.System.SS58Prefix(unsafeToken)
```