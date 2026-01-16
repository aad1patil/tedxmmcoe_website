import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPath) {
    console.error('Error: GOOGLE_APPLICATION_CREDENTIALS not found in .env');
    process.exit(1);
}

const serviceAccount = require(path.resolve(process.cwd(), serviceAccountPath));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'tedxmmcoewebsite.firebasestorage.app' // Hardcoded based on client config
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

async function deleteCollection(collectionPath: string, batchSize: number = 100) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db: FirebaseFirestore.Firestore, query: FirebaseFirestore.Query, resolve: Function) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

async function deleteAllUsers(nextPageToken?: string) {
    // List batch of users, 1000 at a time.
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    const uids = listUsersResult.users.map((user) => user.uid);
    if (uids.length > 0) {
        await auth.deleteUsers(uids);
        console.log(`Deleted ${uids.length} users.`);
    }
    if (listUsersResult.pageToken) {
        // List next batch of users.
        await deleteAllUsers(listUsersResult.pageToken);
    }
}

async function deleteAllFiles() {
    const bucket = storage.bucket();
    const [files] = await bucket.getFiles();
    if (files.length > 0) {
        // Delete files in parallel-ish chunks
        const deletePromises = files.map(file => file.delete());
        await Promise.all(deletePromises);
        console.log(`Deleted ${files.length} files from storage.`);
    } else {
        console.log('No files found in storage.');
    }
}

async function main() {
    try {
        console.log('--- STARTING HARD RESET ---');

        // 1. Delete Firestore Data
        console.log('Deleting Firestore collections...');
        const collections = ['users', 'registrations', 'merchandise_orders'];
        for (const collection of collections) {
            await deleteCollection(collection);
            console.log(`Deleted collection: ${collection}`);
        }

        // 2. Delete Storage Files
        console.log('Deleting Storage files...');
        try {
            await deleteAllFiles();
        } catch (e) {
            console.warn('Error deleting storage files (bucket might be wrong or empty):', e);
        }

        // 3. Delete Auth Users
        console.log('Deleting all Auth users...');
        await deleteAllUsers();

        // 4. Create Admin User
        console.log('Re-creating Admin user...');
        const adminEmail = 'tedxmmcoe@mmcoe.edu.in';
        const adminPassword = 'mmcoexted2620';

        try {
            const userRecord = await auth.createUser({
                email: adminEmail,
                password: adminPassword,
                displayName: 'Admin'
            });

            await auth.setCustomUserClaims(userRecord.uid, { admin: true });
            console.log(`Admin user created successfully: ${adminEmail}`);

            // Optional: Create a user profile in Firestore if your app expects it
            await db.collection('users').doc(userRecord.uid).set({
                email: adminEmail,
                role: 'admin',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            console.log('Admin profile created in Firestore.');

        } catch (e) {
            console.error('Error creating admin user:', e);
        }

        console.log('--- HARD RESET COMPLETE ---');
        process.exit(0);

    } catch (error) {
        console.error('Fatal Error during reset:', error);
        process.exit(1);
    }
}

main();
