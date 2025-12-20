import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// In production, use a service account JSON file.
// For this demo, we'll try to use default application credentials or a mock setup
// if the user hasn't provided credentials in .env yet.
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
            // Remove the projectId if you want to rely on auto-detection usually
        });
        console.log("Firebase Admin Initialized");
    } catch (error) {
        console.error("Firebase Admin Initialization Error (Expected if no credentials):", error);
    }
}

export const db = admin.firestore();
export const auth = admin.auth();
export default admin;
