const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // This is a temporary mock authentication.
        // In a real scenario, you would verify the user in the database.
        
        let role = '';
        let userId = '';

        if (email === 'vendor@example.com' && password === 'password123') {
            role = 'vendor';
            userId = 'V001';
        } else if (email === 'manager@example.com' && password === 'password123') {
            role = 'manager';
            userId = 'M001';
        } else {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT
        // JWT_SECRET should be defined in .env
        const token = jwt.sign(
            { userId, role, email },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1h' }
        );

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            user: { userId, role, email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login' });
    }
};

const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};

module.exports = { login, logout };
