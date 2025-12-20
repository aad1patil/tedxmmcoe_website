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
const router = (0, express_1.Router)();
// Sync User (Called after Firebase Auth on client)
// This creates/updates the user document in Firestore with their Role/Team info
router.post('/sync-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, role, teamRole, phone, name } = req.body;
        if (!token) {
            return res.status(400).json({ success: false, message: 'No token provided' });
        }
        // Verify the Firebase Token
        const decodedToken = yield firebase_1.auth.verifyIdToken(token);
        const uid = decodedToken.uid;
        const email = decodedToken.email;
        // Prepare user data
        const userData = {
            name,
            email,
            phone,
            role,
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
        res.status(401).json({ success: false, message: 'Invalid Token or Server Error' });
    }
}));
// Get Current User Profile (Protected Route example)
router.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
        if (!token)
            return res.status(401).json({ success: false, message: 'No token' });
        const decodedToken = yield firebase_1.auth.verifyIdToken(token);
        const uid = decodedToken.uid;
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
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}));
exports.default = router;
