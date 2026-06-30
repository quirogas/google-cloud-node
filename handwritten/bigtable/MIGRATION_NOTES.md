# Migration Notes: `@google-cloud/bigtable`

## OwlBot Deprecation & Disentanglement Rationale

* **Legacy OwlBot Behavior**: `owlbot.py` copied generated files from `google/bigtable/v2` and admin APIs into `src/v2/`.
* **Target Architecture**:
  * Generated GAPIC client code is moved to the pure, lightweight package `@google-cloud/bigtable-api` in `packages/google-cloud-bigtable-api`.
  * `@google-cloud/bigtable` imports `@google-cloud/bigtable-api` as a standard npm runtime dependency.
* **Backward-Compatibility**:
  * Forwarder shims are placed at `src/v2/index.ts`, `src/v2/bigtable_client.ts`, `src/v2/bigtable_instance_admin_client.ts`, and `src/v2/bigtable_table_admin_client.ts` to ensure legacy deep subpath imports resolve cleanly without breaking existing consumers.
* **Breaking Changes**: None.
