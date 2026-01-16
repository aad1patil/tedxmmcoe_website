import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    screenshotPath: { // Changed from URL to Path for local storage
        type: String,
        required: true
    },
    idCardPath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    type: {
        type: String, // 'ticket' or 'merchandise'
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    ticketCategory: {
        type: String, // 'individual' or 'team'
        default: 'individual'
    },
    institution: {
        type: String,
        default: 'N/A'
    },
    size: {
        type: String // For merchandise
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
