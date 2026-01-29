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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Only this email can be admin
const ADMIN_EMAIL = 'tedxmmcoe@mmcoe.edu.in';
// Generate Token
const generateToken = (id, role, email, name) => {
    return jsonwebtoken_1.default.sign({ id, role, email, name }, process.env.JWT_SECRET || 'secret_key_change_this', {
        expiresIn: '30d',
    });
};
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, phone, college } = req.body;
    try {
        const userExists = yield User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        // Auto-assign admin role ONLY for the specific admin email
        const role = email === ADMIN_EMAIL ? 'admin' : 'user';
        const user = yield User_1.default.create({
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
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User_1.default.findOne({ email });
        if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                college: user.college,
                token: generateToken(user._id.toString(), user.role, user.email, user.name),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
