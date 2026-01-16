import { Request, Response, NextFunction } from 'express';

export const verifyAdmin = async (req: any, res: Response, next: NextFunction) => {
    // This middleware assumes 'protect' has already run and attached 'user' to req
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
};
