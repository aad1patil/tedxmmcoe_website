
import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const serviceAccountPath = path.join(__dirname, '../../service-account.json');

async function listUsers() {
    try {
        console.log(`Attempting to initialize with ${serviceAccountPath}...`);

        // Initialize with the file path directly
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccountPath)
        });

        console.log("Initialization successful (syntactically). Fetching users...");

        const listUsersResult = await admin.auth().listUsers(10);
        console.log('Total users:', listUsersResult.users.length);
        listUsersResult.users.forEach((userRecord) => {
            console.log('user', userRecord.uid, userRecord.email, userRecord.customClaims);
        });

    } catch (error) {
        console.log('Error listing users:', error);
    }
}

listUsers();
