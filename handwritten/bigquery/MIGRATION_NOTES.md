# Migration Notes: `@google-cloud/bigquery`

## OwlBot Deprecation & Disentanglement Rationale

* **Legacy OwlBot Behavior**: `owlbot.py` triggered default Node.js synthesis.
* **Target Architecture**:
  * Generated GAPIC client code is moved to the pure, lightweight package `@google-cloud/bigquery-api` in `packages/google-cloud-bigquery-api`.
  * `@google-cloud/bigquery` imports `@google-cloud/bigquery-api` as a standard npm runtime dependency and re-exports `v2`.
* **Backward-Compatibility**:
  * `v2` namespace is re-exported directly from `@google-cloud/bigquery-api` in `src/index.ts`.
* **Breaking Changes**: None.
