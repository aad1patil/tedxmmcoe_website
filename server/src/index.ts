import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import connectDB from './config/db';

import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import registrationRoutes from './routes/registrations';

dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
// Helmet helps secure Express apps with various HTTP headers
// We need to relax some policies to allow images from our uploads folder if we were using a separate domain,
// but for same-domain it's usually fine.
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/registrations', registrationRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve Frontend (Client)
import fs from 'fs';

// Serve Frontend (Client)
// Adjusted for Docker structure: /app/server/dist/index.js -> /app/client/dist
const clientBuildPath = path.join(__dirname, '../../client/dist');
console.log('Debug: __dirname:', __dirname);
console.log('Debug: clientBuildPath:', clientBuildPath);
console.log('Debug: clientBuildPath exists:', fs.existsSync(clientBuildPath));
console.log('Debug: index.html exists:', fs.existsSync(path.join(clientBuildPath, 'index.html')));

app.use(express.static(clientBuildPath));

// Handle React Routing (return index.html for all other routes)
app.get('*', (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error("Critical: index.html not found at", indexPath);
        res.status(404).send(`Server Error: Client app not found at ${indexPath}. debug: ${__dirname}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
