import {FirestoreClient, FirestoreAdminClient} from '@google-cloud/firestore-api';

export {FirestoreClient, FirestoreAdminClient};

// Doing something really horrible for reverse compatibility with original JavaScript exports
const existingExports = module.exports;
module.exports = FirestoreClient;
module.exports = Object.assign(module.exports, existingExports);
