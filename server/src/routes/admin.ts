import express from 'express';
import Registration from '../models/Registration';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// @route   GET /api/admin/registrations
// @desc    Get all registrations
// @access  Private/Admin
router.get('/registrations', protect, admin, async (req, res) => {
    try {
        const registrations = await Registration.find({}).sort({ createdAt: -1 });
        res.json(registrations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
