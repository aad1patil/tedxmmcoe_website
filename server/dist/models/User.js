"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    college: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
