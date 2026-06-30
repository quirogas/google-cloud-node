# Migration Notes: `@google-cloud/logging`

## OwlBot Deprecation & Disentanglement Rationale

* **Legacy OwlBot Behavior**: `owlbot.py` copied generated files from `google/logging/v2` into `src/v2/`.
* **Target Architecture**:
  * Generated GAPIC client code is moved to the pure, lightweight package `@google-cloud/logging-api` in `packages/google-cloud-logging-api`.
  * `@google-cloud/logging` imports `@google-cloud/logging-api` as a standard npm runtime dependency.
* **Backward-Compatibility**:
  * Forwarder shims are placed at `src/v2/index.ts`, `src/v2/logging_service_v2_client.ts`, `src/v2/config_service_v2_client.ts`, and `src/v2/metrics_service_v2_client.ts` to ensure legacy deep subpath imports resolve cleanly without breaking existing consumers.
* **Breaking Changes**: None.
