import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decodedToken = await auth.verifyIdToken(token);
        if (decodedToken.admin === true) {
            req.user = decodedToken;
            next();
        } else {
            res.status(403).json({ error: 'Forbidden: Admin access required' });
            return;
        }
    } catch (error) {
        console.error('Error verifying admin token:', error);
        res.status(403).json({ error: 'Unauthorized: Invalid token' });
        return;
    }
};
