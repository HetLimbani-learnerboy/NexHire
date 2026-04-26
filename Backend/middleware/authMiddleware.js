const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Extract token from HTTP-only cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        req.user = decoded; // { userId, role, email, iat, exp }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

module.exports = { authMiddleware };
