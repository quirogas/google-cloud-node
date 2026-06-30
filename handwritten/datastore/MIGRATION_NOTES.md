# Migration Notes: `@google-cloud/datastore`

## OwlBot Deprecation & Disentanglement Rationale

* **Legacy OwlBot Behavior**: `owlbot.py` copied generated files from `google/datastore/v1` into `src/v1/`.
* **Target Architecture**:
  * Generated GAPIC client code is moved to the pure, lightweight package `@google-cloud/datastore-api` in `packages/google-cloud-datastore-api`.
  * `@google-cloud/datastore` imports `@google-cloud/datastore-api` as a standard npm runtime dependency.
* **Backward-Compatibility**:
  * Forwarder shims are placed at `src/v1/index.ts`, `src/v1/datastore_client.ts`, and `src/v1/datastore_admin_client.ts` to ensure legacy deep subpath imports resolve cleanly without breaking existing consumers.
* **Breaking Changes**: None.
