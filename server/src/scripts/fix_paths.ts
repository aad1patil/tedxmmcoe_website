import mongoose from 'mongoose';
import path from 'path';

// Root URL for static uploads (as served by express.static)
const STATIC_PREFIX = 'uploads/';

async function fixPaths() {
    const uri = "mongodb+srv://aadip2501_db_user:MMCOExTED2620@cluster0.b7nq6nx.mongodb.net/tedxmmcoe?retryWrites=true&w=majority&appName=Cluster0";

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const Registration = mongoose.model('Registration', new mongoose.Schema({
            name: String,
            screenshotPath: String,
            idCardPath: String
        }));

        const registrations = await Registration.find({});
        console.log(`Scanning ${registrations.length} registrations...`);

        for (const reg of registrations) {
            let updated = false;

            const normalize = (p: string | undefined) => {
                if (!p) return p;
                // If it's already an absolute path like /app/uploads/file.png or //app/...
                // or a relative path like app/uploads/file.png
                // we want only the filename prepended with 'uploads/'
                const filename = path.basename(p);
                return `uploads/${filename}`;
            };

            const oldScreenshot = reg.screenshotPath as string | undefined;
            const newScreenshot = normalize(oldScreenshot);
            if (newScreenshot && oldScreenshot !== newScreenshot) {
                console.log(`Fixing screenshot for ${reg.name}: "${oldScreenshot}" -> "${newScreenshot}"`);
                reg.screenshotPath = newScreenshot;
                updated = true;
            }

            const oldId = reg.idCardPath as string | undefined;
            const newId = normalize(oldId);
            if (newId && oldId !== newId) {
                console.log(`Fixing idCard for ${reg.name}: "${oldId}" -> "${newId}"`);
                reg.idCardPath = newId;
                updated = true;
            }

            if (updated) {
                await reg.save();
            }
        }

        console.log('Path fix complete.');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error during path fix:', error);
    }
}

fixPaths();
