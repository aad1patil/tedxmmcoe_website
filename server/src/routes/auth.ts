import { Router, Request, Response } from 'express';
import { db } from '../config/firebase';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// Sync User (Called after Firebase Auth on client)
// This creates/updates the user document in Firestore with their Role/Team info
router.post('/sync-user', verifyToken, async (req: Request, res: Response) => {
    console.log("Server: /sync-user endpoint hit");
    try {
        const { role, teamRole, phone, name } = req.body;
        const { uid, email } = req.user; // Set by verifyToken middleware

        // Prepare user data
        const userData: any = {
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
        await db.collection('users').doc(uid).set(userData, { merge: true });

        // Ideally, we might set Custom User Claims here for role-based security rules
        // e.g., await auth.setCustomUserClaims(uid, { role });

        res.json({
            success: true,
            message: 'User synced successfully',
            user: { id: uid, ...userData }
        });

    } catch (err: any) {
        console.error('Sync Error:', err.message);
        res.status(500).json({ success: false, message: 'Server Verification Error' });
    }
});

// Get Current User Profile (Protected Route)
router.get('/me', verifyToken, async (req: Request, res: Response) => {
    try {
        const { uid } = req.user;

        const userDoc = await db.collection('users').doc(uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User profile not found' });
        }

        res.json({
            success: true,
            user: { id: uid, ...userDoc.data() }
        });

    } catch (err: any) {
        console.error('Profile Error:', err.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
