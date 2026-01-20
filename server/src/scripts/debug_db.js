const mongoose = require('mongoose');

async function debug() {
    const uri = "mongodb+srv://aadip2501_db_user:MMCOExTED2620@cluster0.b7nq6nx.mongodb.net/tedxmmcoe?retryWrites=true&w=majority&appName=Cluster0";
    try {
        await mongoose.connect(uri);
        console.log('Connected');
        const Registration = mongoose.model('Registration', new mongoose.Schema({
            name: String,
            screenshotPath: String,
            idCardPath: String
        }));

        const regs = await Registration.find({}).sort({ _id: -1 }).limit(5);
        console.log('Last 5 registrations:');
        regs.forEach(r => {
            console.log(`- ${r.name}: P=${r.screenshotPath}, ID=${r.idCardPath}`);
        });
        await mongoose.disconnect();
    } catch (e) {
        console.error(e);
    }
}
debug();
