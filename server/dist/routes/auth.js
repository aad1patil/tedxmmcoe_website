"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const firebase_1 = require("../config/firebase");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Sync User (Called after Firebase Auth on client)
// This creates/updates the user document in Firestore with their Role/Team info
router.post('/sync-user', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Server: /sync-user endpoint hit");
    try {
        const { role, teamRole, phone, name, college } = req.body;
        const { uid, email } = req.user; // Set by verifyToken middleware
        // Prepare user data
        const userData = {
            name,
            email,
            phone,
            role,
            college: college || 'MMCOE', // Default to MMCOE if not provided
            updatedAt: new Date().toISOString()
        };
        if (teamRole) {
            userData.teamRole = teamRole;
        }
        // Store in Firestore "users" collection
        yield firebase_1.db.collection('users').doc(uid).set(userData, { merge: true });
        // Ideally, we might set Custom User Claims here for role-based security rules
        // e.g., await auth.setCustomUserClaims(uid, { role });
        res.json({
            success: true,
            message: 'User synced successfully',
            user: Object.assign({ id: uid }, userData)
        });
    }
    catch (err) {
        console.error('Sync Error:', err.message);
        res.status(500).json({ success: false, message: 'Server Verification Error' });
    }
}));
// Get Current User Profile (Protected Route)
router.get('/me', authMiddleware_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.user;
        const userDoc = yield firebase_1.db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }
        res.json({
            success: true,
            user: Object.assign({ id: uid }, userDoc.data())
        });
    }
    catch (err) {
        console.error('Profile Error:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}));
exports.default = router;
