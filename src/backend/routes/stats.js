import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
    try {
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalPatients = await User.countDocuments({ role: 'patient' });
        
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        
        const appointmentsToday = await Appointment.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        res.json({ totalDoctors, totalPatients, appointmentsToday });
    } catch (error) {
        res.status(500).json({ message: 'Serv err' });
    }
});

export default router;