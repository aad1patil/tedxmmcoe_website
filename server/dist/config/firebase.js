"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = exports.db = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// In production, use a service account JSON file.
// For this demo, we'll try to use default application credentials or a mock setup
// if the user hasn't provided credentials in .env yet.
if (!firebase_admin_1.default.apps.length) {
    try {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.applicationDefault(),
            // Remove the projectId if you want to rely on auto-detection usually
        });
        console.log("Firebase Admin Initialized");
    }
    catch (error) {
        console.error("Firebase Admin Initialization Error (Expected if no credentials):", error);
    }
}
exports.db = firebase_admin_1.default.firestore();
exports.auth = firebase_admin_1.default.auth();
exports.default = firebase_admin_1.default;
