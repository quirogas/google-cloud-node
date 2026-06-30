# Migration Notes: `@google-cloud/pubsub`

## OwlBot Deprecation & Disentanglement Rationale

* **Legacy OwlBot Behavior**: `owlbot.py` ran default Node.js postprocessing with template exclusions (`src/index.ts`, `README.md`, `.github/workflows/ci.yaml`) and copied generated files from `google/pubsub/v1` into `src/v1/`.
* **Target Architecture**:
  * Generated GAPIC client code is moved to the pure, lightweight package `@google-cloud/pubsub-api` in `packages/google-cloud-pubsub-api`.
  * `@google-cloud/pubsub` imports `@google-cloud/pubsub-api` as a standard npm runtime dependency.
* **Backward-Compatibility**:
  * Forwarder shims are placed at `src/v1/index.ts`, `src/v1/publisher_client.ts`, `src/v1/schema_service_client.ts`, and `src/v1/subscriber_client.ts` to ensure legacy deep subpath imports (e.g. `import {SubscriberClient} from '@google-cloud/pubsub/build/src/v1/subscriber_client'`) resolve cleanly without breaking existing consumers.
* **Breaking Changes**: None.
