import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const serviceAccountPath = path.join(__dirname, '../../service-account.json');

console.log(`Checking ${serviceAccountPath}...`);

try {
    const content = fs.readFileSync(serviceAccountPath, 'utf8');
    try {
        const serviceAccount = JSON.parse(content);
        let key = serviceAccount.private_key;

        if (key) {
            console.log("Private Key found. Verifying...");

            // Helper to test key
            const isKeyValid = (k: string) => {
                try {
                    crypto.createPrivateKey(k);
                    return true;
                } catch (e) {
                    return false;
                }
            };

            if (isKeyValid(key)) {
                console.log("SUCCESS: Key is already VALID.");
            } else {
                console.log("ERROR: Key is INVALID. Attempting repair...");

                // 1. Strip headers and footers
                let rawBody = key
                    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
                    .replace(/-----END PRIVATE KEY-----/g, '')
                    .replace(/\\n/g, '') // remove escaped newlines if any remain
                    .replace(/\n/g, '') // remove actual newlines
                    .replace(/\s/g, ''); // remove all whitespace

                // 2. Re-wrap with correct headers and 64-char lines
                const chunkSize = 64;
                const chunks = [];
                for (let i = 0; i < rawBody.length; i += chunkSize) {
                    chunks.push(rawBody.slice(i, i + chunkSize));
                }
                const fixedKey = `-----BEGIN PRIVATE KEY-----\n${chunks.join('\n')}\n-----END PRIVATE KEY-----\n`;

                console.log("Repaired Key generated.");

                if (isKeyValid(fixedKey)) {
                    console.log("SUCCESS: Repaired key is VALID!");
                    console.log("Writing repaired key back to service-account.json...");

                    serviceAccount.private_key = fixedKey;
                    fs.writeFileSync(serviceAccountPath, JSON.stringify(serviceAccount, null, 2));
                    console.log("FIXED: service-account.json updated successfully.");
                } else {
                    console.error("FAILURE: Repair attempt failed. The key data itself might be corrupted.");
                }
            }

        } else {
            console.log("Private Key: MISSING");
        }

    } catch (e: any) {
        console.error("Invalid JSON:", e.message);
    }
} catch (error: any) {
    console.error("Error reading file:", error.message);
}
