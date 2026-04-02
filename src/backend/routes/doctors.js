import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' })
            .select('firstName lastName specialization experienceYears phone availableSlots');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'err when getting the list of doctors' });
    }
});

router.post('/:id/slots', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
    try {
        const { slot } = req.body;
        const doctor = await User.findById(req.params.id);
        if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

        const slotDate = new Date(slot);
        if (doctor.availableSlots.some(s => s.getTime() === slotDate.getTime())) {
            return res.status(400).json({ message: 'Slot already exists' });
        }

        doctor.availableSlots.push(slotDate);
        doctor.availableSlots.sort((a, b) => a - b);
        await doctor.save();
        
        res.json(doctor.availableSlots);
    } catch (error) {
        res.status(500).json({ message: 'Err adding slot' });
    }
});

router.delete('/:id/slots/:slot', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
    try {
        const slotDate = new Date(req.params.slot);
        const doctor = await User.findById(req.params.id);
        
        doctor.availableSlots = doctor.availableSlots.filter(s => s.getTime() !== slotDate.getTime());
        await doctor.save();
        
        res.json(doctor.availableSlots);
    } catch (error) {
        res.status(500).json({ message: 'Err removing slot' });
    }
});

export default router;