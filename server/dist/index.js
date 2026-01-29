"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const registrations_1 = __importDefault(require("./routes/registrations"));
dotenv_1.default.config();
// Connect to Database
(0, db_1.default)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5001;
app.use((0, cors_1.default)());
// Helmet helps secure Express apps with various HTTP headers
// Disable Content-Security-Policy for now as it blocks Vite's crossorigin scripts
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Disable CSP to allow React app to load
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/registrations', registrations_1.default);
// Make uploads folder static
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// Serve Frontend (Client)
const fs_1 = __importDefault(require("fs"));
// Serve Frontend (Client)
// Adjusted for Docker structure: /app/server/dist/index.js -> /app/client/dist
const clientBuildPath = path_1.default.join(__dirname, '../../client/dist');
console.log('Debug: __dirname:', __dirname);
console.log('Debug: clientBuildPath:', clientBuildPath);
console.log('Debug: clientBuildPath exists:', fs_1.default.existsSync(clientBuildPath));
console.log('Debug: index.html exists:', fs_1.default.existsSync(path_1.default.join(clientBuildPath, 'index.html')));
app.use(express_1.default.static(clientBuildPath));
// Handle React Routing (return index.html for all other routes)
app.get('*', (req, res) => {
    const indexPath = path_1.default.join(clientBuildPath, 'index.html');
    if (fs_1.default.existsSync(indexPath)) {
        res.sendFile(indexPath);
    }
    else {
        console.error("Critical: index.html not found at", indexPath);
        res.status(404).send(`Server Error: Client app not found at ${indexPath}. debug: ${__dirname}`);
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
