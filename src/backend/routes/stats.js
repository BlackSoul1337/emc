import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/summary', async (req, res) => {
    try {
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalPatients = await User.countDocuments({ role: 'patient' });
        
        const endOfDay = new Date();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 999);
        
        const appointmentsToday = await Appointment.countDocuments({
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        // Weekly Activity data
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const weeklyAppts = await Appointment.aggregate([
            { $match: { date: { $gte: sevenDaysAgo } } },
            { $group: {
                _id: { $dayOfWeek: "$date" }, // 1=Sun, 2=Mon...
                patients: { $sum: 1 }
            }}
        ]);

        const daysMap = { 1: 'Sun', 2: 'Mon', 3: 'Tue', 4: 'Wed', 5: 'Thu', 6: 'Fri', 7: 'Sat' };
        
        const weeklyActivity = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayIndex = d.getDay() + 1; // getDay() is 0-6, MongoDB dayOfWeek is 1-7
            const stat = weeklyAppts.find(item => item._id === dayIndex);
            weeklyActivity.push({
                name: daysMap[dayIndex],
                patients: stat ? stat.patients : 0
            });
        }

        res.json({ totalDoctors, totalPatients, appointmentsToday, weeklyActivity });
    } catch (error) {
        res.status(500).json({ message: 'Serv err' });
    }
});

export default router;