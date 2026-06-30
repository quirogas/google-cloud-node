# Migration Notes: `@google-cloud/bigquery-storage`

## OwlBot Deprecation & Disentanglement Rationale

* **Legacy OwlBot Behavior**: `owlbot.py` copied generated files from `google/cloud/bigquery/storage/v1` into `src/v1/`.
* **Target Architecture**:
  * Generated GAPIC client code is moved to the pure, lightweight package `@google-cloud/bigquery-storage-api` in `packages/google-cloud-bigquery-storage-api`.
  * `@google-cloud/bigquery-storage` imports `@google-cloud/bigquery-storage-api` as a standard npm runtime dependency.
* **Backward-Compatibility**:
  * Forwarder shims are placed at `src/v1/index.ts`, `src/v1/big_query_read_client.ts`, and `src/v1/big_query_write_client.ts` to ensure legacy deep subpath imports resolve cleanly without breaking existing consumers.
* **Breaking Changes**: None.
