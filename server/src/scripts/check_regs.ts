import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    screenshotPath: String,
    idCardPath: String,
    createdAt: Date
});

const Registration = mongoose.model('Registration', registrationSchema);

async function checkData() {
    try {
        const uri = "mongodb+srv://aadip2501_db_user:MMCOExTED2620@cluster0.b7nq6nx.mongodb.net/tedxmmcoe?retryWrites=true&w=majority&appName=Cluster0";
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const regs = await Registration.find({}).sort({ createdAt: -1 }).limit(10);

        console.log('Recent Registrations:');
        regs.forEach(r => {
            console.log(`- Name: ${r.name}`);
            console.log(`  Email: ${r.email}`);
            console.log(`  Screenshot: ${r.screenshotPath}`);
            console.log(`  ID Card: ${r.idCardPath}`);
            console.log(`  Created At: ${r.createdAt}`);
            console.log('---');
        });

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkData();
