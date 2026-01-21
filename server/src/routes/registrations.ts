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
// @desc    Get total registration count (Public)
router.get('/count', async (req, res) => {
    try {
        const count = await Registration.countDocuments({ type: { $ne: 'merchandise' } });
        res.json({ count });
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
router.post('/', protect, uploadFields, async (req: any, res) => {
    try {
        const { transactionId, type, ticketCategory, institution, size, amount, passOption } = req.body;

        if (!req.files || !req.files.screenshot) {
            return res.status(400).json({ message: 'Payment Screenshot is required.' });
        }

        // ID Card is required ONLY for tickets, not for merchandise
        if (type !== 'merchandise' && !req.files.idCard) {
            // Clean up uploaded screenshot if validation fails
            if (req.files.screenshot[0].path) fs.unlinkSync(req.files.screenshot[0].path);
            return res.status(400).json({ message: 'College ID Card is required for tickets.' });
        }

        // Check for limit (160)
        const count = await Registration.countDocuments({ type: { $ne: 'merchandise' } });
        if (type !== 'merchandise' && count >= 160) {
            // Delete uploaded files if limit reached
            if (req.files.screenshot?.[0]?.path) fs.unlinkSync(req.files.screenshot[0].path);
            if (req.files.idCard?.[0]?.path) fs.unlinkSync(req.files.idCard[0].path);
            return res.status(400).json({ message: 'Registrations are now closed. Maximum capacity reached.' });
        }

        // Fetch user from database to get the most up-to-date name
        const user = await User.findById(req.user.id);
        if (!user) {
            if (req.files.screenshot?.[0]?.path) fs.unlinkSync(req.files.screenshot[0].path);
            if (req.files.idCard?.[0]?.path) fs.unlinkSync(req.files.idCard[0].path);
            return res.status(404).json({ message: 'User not found' });
        }

        // Normalize paths to be relative (e.g., uploads/filename.png)
        // This prevents issues with absolute paths in Docker
        const screenshotPath = `uploads/${path.basename(req.files.screenshot[0].path)}`;
        const idCardPath = req.files.idCard?.[0] ? `uploads/${path.basename(req.files.idCard[0].path)}` : undefined;

        const registration = await Registration.create({
            userId: req.user.id,
            name: user.name,
            email: user.email,
            transactionId,
            screenshotPath,
            idCardPath,
            type,
            ticketCategory,
            institution,
            size,
            passOption,
            amount: Number(amount), // Ensure it's a number
        });

        res.status(201).json(registration);
    } catch (error: any) {
        console.error("Registration Error:", error);
        // Attempt to clean up files if database creation fails
        if (req.files?.screenshot?.[0]?.path) try { fs.unlinkSync(req.files.screenshot[0].path); } catch (e) { }
        if (req.files?.idCard?.[0]?.path) try { fs.unlinkSync(req.files.idCard[0].path); } catch (e) { }
        res.status(500).json({ message: error.message });
    }
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
