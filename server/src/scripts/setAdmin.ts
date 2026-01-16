
import { auth } from '../config/firebase';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Try to load from server root
const envPath = path.resolve(__dirname, '../../.env');
console.log(`Loading .env from: ${envPath}`);
dotenv.config({ path: envPath });

console.log("Service Account Env Var Length:", process.env.FIREBASE_SERVICE_ACCOUNT ? process.env.FIREBASE_SERVICE_ACCOUNT.length : 0);


const setAdmin = async (email: string) => {
    try {
        const user = await auth.getUserByEmail(email);
        await auth.setCustomUserClaims(user.uid, { admin: true });
        console.log(`Successfully set admin claim for user: ${email}`);
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            console.error(`User ${email} not found. Please sign up first.`);
        } else {
            console.error('Error setting admin claim:', error);
        }
    }
};

const adminEmail = 'tedxmmcoe@mmcoe.edu.in';
setAdmin(adminEmail);
