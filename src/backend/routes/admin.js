import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.post('/create-doctor', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, iin, specialization, experienceYears } = req.body;

        if (!email || !password || !iin || !specialization) {
            return res.status(400).json({ message: 'missing required fields' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { iin }] });
        if (userExists) {
            return res.status(400).json({ message: 'user with this email or iin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDoctor = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            iin,
            role: 'doctor',
            specialization,
            experienceYears,
            isActivated: true
        });

        await newDoctor.save();

        res.status(201).json({ 
            message: 'doctor successfully authorized', 
            doctor: { id: newDoctor._id, email: newDoctor.email, specialization: newDoctor.specialization } 
        });

    } catch (error) {
        console.error('Create doctor error:', error);
        res.status(500).json({ message: 'serv err while doctor creating' });
    }
});

export default router;