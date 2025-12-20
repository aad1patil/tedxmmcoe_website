import { Router, Request, Response } from 'express';
import { auth, db } from '../config/firebase';

const router = Router();

// Sync User (Called after Firebase Auth on client)
// This creates/updates the user document in Firestore with their Role/Team info
router.post('/sync-user', async (req: Request, res: Response) => {
    try {
        const { token, role, teamRole, phone, name } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, message: 'No token provided' });
        }

        // Verify the Firebase Token
        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

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
        res.status(401).json({ success: false, message: 'Invalid Token or Server Error' });
    }
});

// Get Current User Profile (Protected Route example)
router.get('/me', async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) return res.status(401).json({ success: false, message: 'No token' });

        const decodedToken = await auth.verifyIdToken(token);
        const uid = decodedToken.uid;

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
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
});

export default router;
