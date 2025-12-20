import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('TEDxMMCOE API is running (Firebase Enabled)');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
