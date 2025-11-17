# For setup

## Polkadot dependency

```bash
cd backend
npm install polkadot-api
```
### Westend Ecosystem Chains

```bash
npx papi add westend2 -n westend2
npx papi add westend2_asset_hub -n westend2_asset_hub
npx papi add westend2_bridge_hub -n westend2_bridge_hub
npx papi add westend2_collectives -n westend2_collectives
npx papi add westend2_coretime -n westend2_coretime
npx papi add westend2_people -n westend2_people
```
### Generate Descriptors

```bash
npx papi
```