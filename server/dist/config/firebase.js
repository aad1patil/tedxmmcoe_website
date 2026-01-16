"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Check if apps are already initialized to avoid "already exists" error
if (!firebase_admin_1.default.apps.length) {
    try {
        let credential;
        // 1. Try GOOGLE_APPLICATION_CREDENTIALS env var (handled automatically by applicationDefault)
        // 2. Try looking for 'service-account.json' in the server root if available
        // Note: applicationDefault() automatically checks GOOGLE_APPLICATION_CREDENTIALS
        // and well-known locations.
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            try {
                const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.cert(serviceAccount)
                });
            }
            catch (e) {
                console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT:", e);
                // Fallback
                firebase_admin_1.default.initializeApp({
                    credential: firebase_admin_1.default.credential.applicationDefault()
                });
            }
        }
        else {
            firebase_admin_1.default.initializeApp({
                credential: firebase_admin_1.default.credential.applicationDefault()
            });
        }
        console.log("Firebase Admin Initialized");
    }
    catch (error) {
        console.error("Firebase Admin Initialization Error:", error);
        console.error("Please ensure GOOGLE_APPLICATION_CREDENTIALS is set or a service account key is available.");
    }
}
exports.db = firebase_admin_1.default.firestore();
exports.auth = firebase_admin_1.default.auth();
exports.default = firebase_admin_1.default;
