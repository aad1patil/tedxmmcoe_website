import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Only this email can be admin
const ADMIN_EMAIL = 'tedxmmcoe@mmcoe.edu.in';

// Generate Token
const generateToken = (id: string, role: string, email: string, name: string) => {
    return jwt.sign({ id, role, email, name }, process.env.JWT_SECRET || 'secret_key_change_this', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, phone, college } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Auto-assign admin role ONLY for the specific admin email
        const role = email === ADMIN_EMAIL ? 'admin' : 'user';

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            college
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                college: user.college,
                token: generateToken(user._id.toString(), user.role, user.email, user.name),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                college: user.college,
                token: generateToken(user._id.toString(), user.role, user.email, user.name),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
