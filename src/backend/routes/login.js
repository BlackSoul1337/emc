import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Settings from '../models/Settings.js';

const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'email and pass required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'user w this email not found' });

        let requireEmailAuthSetting = await Settings.findOne({ key: 'requireEmailAuth' });
        const requireEmailAuth = requireEmailAuthSetting ? requireEmailAuthSetting.value : false;

        if (requireEmailAuth && !user.isActivated && user.role === 'patient') {
            return res.status(403).json({ message: 'Account is not activated! Email confirmation is currently required by Admin.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'incorrect pass' });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // For cross-origin on Render
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(200).json({
            user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, phone: user.phone, role: user.role, avatarUrl: user.avatarUrl }
        });


    } catch (error) {
        console.error('login err:', error);
        res.status(500).json({ message: 'serv auth err' });
    }
});

router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.json({ message: 'Logged out successfully' });
});

export default router;