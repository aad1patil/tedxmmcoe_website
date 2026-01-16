import { auth } from '../config/firebase';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars if not already loaded (though config/firebase should handle it)
dotenv.config({ path: path.join(__dirname, '../../.env') });

const grantAdmin = async (email: string) => {
    try {
        console.log(`Looking up user ${email}...`);
        const user = await auth.getUserByEmail(email);

        console.log(`Found user ${user.uid}. Current claims:`, user.customClaims);

        if (user.customClaims && user.customClaims.admin === true) {
            console.log("User is ALREADY an admin.");
            return;
        }

        console.log("Granting 'admin' claim...");
        await auth.setCustomUserClaims(user.uid, { admin: true });

        const updatedUser = await auth.getUser(user.uid);
        console.log("SUCCESS! New claims:", updatedUser.customClaims);
        console.log("NOTE: The user must logout and login again for the token to refresh.");

    } catch (error: any) {
        console.error("Error granting admin:", error);
    }
};

const email = process.argv[2] || 'tedxmmcoe@mmcoe.edu.in';
grantAdmin(email);
