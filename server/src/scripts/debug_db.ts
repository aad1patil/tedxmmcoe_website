import mongoose from 'mongoose';

async function debug() {
    const uri = "mongodb+srv://aadip2501_db_user:MMCOExTED2620@cluster0.b7nq6nx.mongodb.net/tedxmmcoe?retryWrites=true&w=majority&appName=Cluster0";
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        const Registration = mongoose.model('Registration', new mongoose.Schema({
            name: String,
            screenshotPath: String,
            idCardPath: String,
            createdAt: Date
        }));

        const regs = await Registration.find({}).sort({ createdAt: -1 }).limit(10);
        console.log('Last 10 registrations:');
        regs.forEach(r => {
            console.log(`- ${r.name}:`);
            console.log(`  Screenshot: "${(r as any).screenshotPath}"`);
            console.log(`  ID Card:    "${(r as any).idCardPath}"`);
        });
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
debug();
