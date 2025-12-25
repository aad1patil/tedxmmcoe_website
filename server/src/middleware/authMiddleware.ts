import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any; // Replace 'any' with a more specific type if desired
        }
    }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).json({ error: 'Unauthorized: Invalid token' });
        return;
    }
};
