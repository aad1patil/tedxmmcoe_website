import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_change_this');
            req.user = decoded;
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
    const ADMIN_EMAIL = 'tedxmmcoe@mmcoe.edu.in';
    if (req.user && req.user.role === 'admin' && req.user.email === ADMIN_EMAIL) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};
