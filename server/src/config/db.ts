import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/tedxmmcoe';
        console.log(`Attempting to connect to MongoDB at: ${mongoURI}`);

        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        // Retry connection logic
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;
