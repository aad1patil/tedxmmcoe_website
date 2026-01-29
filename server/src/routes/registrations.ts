import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Registration from '../models/Registration';
import User from '../models/User';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Configure Multer for local storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads/');
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    },
});

// @route   GET /api/registrations/count
// @desc    Get total and MMIT registration count (Public)
router.get('/count', async (req, res) => {
    try {
        const totalCount = await Registration.countDocuments({ type: { $ne: 'merchandise' } });
        const mmitCount = await Registration.countDocuments({
            type: { $ne: 'merchandise' },
            institution: 'MMIT'
        });
        res.json({ count: totalCount, mmitCount });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    }
});

const uploadFields = upload.fields([
    { name: 'screenshot', maxCount: 1 },
    { name: 'idCard', maxCount: 1 },
]);

// @route   POST /api/registrations
// @desc    Create a new registration
// @access  Private
router.post('/', protect, async (req: any, res) => {
    return res.status(403).json({ message: 'Registrations are now closed. We have reached maximum capacity.' });
});

// @route   GET /api/registrations/my
// @desc    Get logged in user's registrations
// @access  Private
router.get('/my', protect, async (req: any, res) => {
    try {
        const registrations = await Registration.find({ userId: req.user.id });
        res.json(registrations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
