import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' })
            .select('firstName lastName specialization experienceYears phone');
        
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'err when getting the list of doctors' });
    }
});

export default router;