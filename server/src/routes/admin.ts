import express from 'express';
import Registration from '../models/Registration';
import { protect, admin } from '../middleware/authMiddleware';
import { sendConfirmationEmail } from '../utils/email';

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

// @route   PATCH /api/admin/registrations/:id/status
// @desc    Update registration status
// @access  Private/Admin
router.patch('/registrations/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['pending', 'confirmed', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        res.json(registration);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/admin/send-email/:id
// @desc    Send confirmation email to a registrant
// @access  Private/Admin
router.post('/send-email/:id', protect, admin, async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);

        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }

        await sendConfirmationEmail({
            to: registration.email,
            name: registration.name,
            ticketCategory: registration.ticketCategory,
        });

        res.json({ message: 'Confirmation email sent successfully', email: registration.email });
    } catch (error: any) {
        console.error('Email sending error:', error);
        res.status(500).json({ message: 'Failed to send email: ' + error.message });
    }
});

export default router;

