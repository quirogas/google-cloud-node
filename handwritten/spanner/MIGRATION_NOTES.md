# Migration Notes: `@google-cloud/spanner`

## OwlBot Deprecation & Disentanglement Rationale

* **Legacy OwlBot Behavior**: `owlbot.py` copied generated files from `google/spanner/v1` and admin APIs into `src/v1/`.
* **Target Architecture**:
  * Generated GAPIC client code is moved to the pure, lightweight package `@google-cloud/spanner-api` in `packages/google-cloud-spanner-api`.
  * `@google-cloud/spanner` imports `@google-cloud/spanner-api` as a standard npm runtime dependency.
* **Backward-Compatibility**:
  * Forwarder shims are placed at `src/v1/index.ts`, `src/v1/spanner_client.ts`, `src/v1/database_admin_client.ts`, `src/v1/instance_admin_client.ts`, and `src/v1/spanner_executor_proxy_client.ts` to ensure legacy deep subpath imports resolve cleanly without breaking existing consumers.
* **Breaking Changes**: None.
