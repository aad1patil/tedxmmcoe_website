import { db } from '../config/firebase';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkRegistrations = async () => {
    try {
        console.log("Fetching registrations...");
        const snapshot = await db.collection('registrations').orderBy('timestamp', 'desc').get();

        if (snapshot.empty) {
            console.log("No registrations found.");
            return;
        }

        console.log(`Found ${snapshot.size} registrations:`);
        snapshot.forEach(doc => {
            const data = doc.data();
            console.log("------------------------------------------------");
            console.log(`ID: ${doc.id}`);
            console.log(`User: ${data.name} (${data.email})`);
            console.log(`Transaction ID: ${data.transactionId}`);
            console.log(`Screenshot URL: ${data.screenshotUrl ? 'Present' : 'Missing'}`);
            console.log(`Status: ${data.status}`);
            console.log(`Time: ${data.timestamp ? data.timestamp.toDate() : 'N/A'}`);
        });
        console.log("------------------------------------------------");

    } catch (error) {
        console.error("Error fetching registrations:", error);
    }
};

checkRegistrations();
