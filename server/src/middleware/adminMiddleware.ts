import { Request, Response, NextFunction } from 'express';

// Only this email can be admin
const ADMIN_EMAIL = 'tedxmmcoe@mmcoe.edu.in';

export const verifyAdmin = async (req: any, res: Response, next: NextFunction) => {
    // This middleware assumes 'protect' has already run and attached 'user' to req
    // Check BOTH role AND email for extra security
    if (req.user && req.user.role === 'admin' && req.user.email === ADMIN_EMAIL) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
};
