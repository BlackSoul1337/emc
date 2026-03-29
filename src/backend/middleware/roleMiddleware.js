export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (req.method === 'OPTIONS') {
            return next();
        }

        try {
            if (!req.user || !allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ message: 'no permission' });
            }
            
            next();
        } catch (error) {
            console.error('role middleware error:', error.message);
            return res.status(403).json({ message: 'err checking role access' });
        }
    };
};