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
            screenshotPath: String,
            idCardPath: String
        }));

        const registrations = await Registration.find({
            $or: [
                { screenshotPath: { $regex: /^\// } }, // Starts with /
                { idCardPath: { $regex: /^\// } }
            ]
        });

        console.log(`Found ${registrations.length} registrations with absolute paths.`);

        for (const reg of registrations) {
            let updated = false;

            if (reg.screenshotPath && reg.screenshotPath.startsWith('/')) {
                const filename = path.basename(reg.screenshotPath);
                reg.screenshotPath = path.join(STATIC_PREFIX, filename);
                updated = true;
            }

            if (reg.idCardPath && reg.idCardPath.startsWith('/')) {
                const filename = path.basename(reg.idCardPath);
                reg.idCardPath = path.join(STATIC_PREFIX, filename);
                updated = true;
            }

            if (updated) {
                await reg.save();
                console.log(`Fixed paths for registration ID: ${reg._id}`);
            }
        }

        console.log('Path fix complete.');
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error during path fix:', error);
    }
}

fixPaths();
