# Migration Notes: `@google-cloud/firestore`

## OwlBot Deprecation & Disentanglement Rationale

* **Legacy OwlBot Behavior**: `owlbot.py` copied generated files from `google/firestore/v1`, `v1beta1`, and `admin/v1` into `dev/src/v1` and `dev/src/v1beta1`.
* **Target Architecture**:
  * Generated GAPIC client code is moved to the pure, lightweight package `@google-cloud/firestore-api` in `packages/google-cloud-firestore-api`.
  * `@google-cloud/firestore` imports `@google-cloud/firestore-api` as a standard npm runtime dependency.
* **Backward-Compatibility**:
  * Forwarder shims are placed at `dev/src/v1/index.ts`, `dev/src/v1/firestore_client.ts`, `dev/src/v1/firestore_admin_client.ts`, `dev/src/v1beta1/index.ts`, and `dev/src/v1beta1/firestore_client.ts` to ensure legacy deep subpath imports resolve cleanly without breaking existing consumers.
* **Breaking Changes**: None.
