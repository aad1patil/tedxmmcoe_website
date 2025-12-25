import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Check if apps are already initialized to avoid "already exists" error
if (!admin.apps.length) {
    try {
        let credential;

        // 1. Try GOOGLE_APPLICATION_CREDENTIALS env var (handled automatically by applicationDefault)
        // 2. Try looking for 'service-account.json' in the server root if available

        // Note: applicationDefault() automatically checks GOOGLE_APPLICATION_CREDENTIALS
        // and well-known locations.

        admin.initializeApp({
            credential: admin.credential.applicationDefault()
        });
        console.log("Firebase Admin Initialized");
    } catch (error) {
        console.error("Firebase Admin Initialization Error:", error);
        console.error("Please ensure GOOGLE_APPLICATION_CREDENTIALS is set or a service account key is available.");
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
