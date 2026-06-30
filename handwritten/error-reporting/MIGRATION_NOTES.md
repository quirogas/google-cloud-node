# Migration Notes: `@google-cloud/error-reporting`

## OwlBot Deprecation & Disentanglement Rationale

* **Legacy OwlBot Behavior**: `owlbot.py` managed synthetic templates for error-reporting.
* **Target Architecture**:
  * Generated GAPIC client code is moved to the pure, lightweight package `@google-cloud/error-reporting-api` in `packages/google-cloud-error-reporting-api`.
  * `@google-cloud/error-reporting` imports `@google-cloud/error-reporting-api` as a standard npm runtime dependency and re-exports `v1beta1`.
* **Backward-Compatibility**:
  * `v1beta1` namespace is re-exported directly from `@google-cloud/error-reporting-api` in `src/index.ts`.
* **Breaking Changes**: None.
