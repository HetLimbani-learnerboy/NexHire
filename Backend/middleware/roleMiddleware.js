const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        const role = req.headers.role;
        if (!role) {
            return res.status(401).json({
                success: false,
                message: "Role missing"
            });
        }
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }
        next();
    };
};

module.exports = roleMiddleware;