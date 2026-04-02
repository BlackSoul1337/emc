import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/auth', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ message: 'user not found' });
        
        res.json({
            user: { 
                id: user._id, email: user.email, firstName: user.firstName, 
                lastName: user.lastName, phone: user.phone, role: user.role, 
                avatarUrl: user.avatarUrl, availableSlots: user.availableSlots 
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'serv error while auth checking' });
    }
});

router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;

        if (!/^\+?[0-9]{10,15}$/.test(phone)) {
            return res.status(400).json({ message: 'Invalid phone format (must be + and 10-15 digits)' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.userId, { firstName, lastName, phone }, { new: true, runValidators: true }
        ).select('-password');
        
        res.json({ message: 'Profile updated', user });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
});

export default router;