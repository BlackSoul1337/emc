import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('doctorId', 'firstName lastName specialization')
            .populate('patientId', 'firstName lastName iin phone')
            .sort({ date: -1 });

        res.status(200).json(appointments);
    } catch (error) {
        console.error('fetch all appointments err:', error);
        res.status(500).json({ message: 'serv err when receiving all records' });
    }
});

router.post('/book', authMiddleware, roleMiddleware(['patient']), async (req, res) => {
    try {
        const { doctorId, date, notes } = req.body;
        const patientId = req.user.userId;

        if (!doctorId || !date) {
            return res.status(400).json({ message: 'you must specify the doctor and the date of the appointment' });
        }

        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') {
            return res.status(404).json({ message: 'the selected doctor wasnt found' });
        }

        const existingAppointment = await Appointment.findOne({ doctorId, date });
        if (existingAppointment) {
            return res.status(400).json({ message: 'the doctor has already taken this time' });
        }

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            date,
            notes,
            status: 'scheduled'
        });

        await newAppointment.save();

        res.status(201).json({ 
            message: 'you have successfully made an appointment', 
            appointment: newAppointment 
        });

    } catch (error) {
        console.error('booking error:', error);
        res.status(500).json({ message: 'serv err when making an appointment' });
    }
});

router.get('/patient', authMiddleware, roleMiddleware(['patient']), async (req, res) => {
    try {
        const patientId = req.user.userId;

        const appointments = await Appointment.find({ patientId })
            .populate('doctorId', 'firstName lastName specialization')
            .sort({ date: 1 });

        res.status(200).json(appointments);

    } catch (error) {
        console.error('fetch patient appointments err:', error);
        res.status(500).json({ message: 'serv err when receiving records' });
    }
});

router.get('/doctor', authMiddleware, roleMiddleware(['doctor']), async (req, res) => {
    try {
        const doctorId = req.user.userId;

        const appointments = await Appointment.find({ doctorId })
            .populate('patientId', 'firstName lastName iin phone')
            .sort({ date: 1 });

        res.status(200).json(appointments);

    } catch (error) {
        console.error('fetch doctor schedule err:', error);
        res.status(500).json({ message: 'serv err when receiving the schedule' });
    }
});

router.put('/:id', authMiddleware, roleMiddleware(['doctor', 'admin']), async (req, res) => {
    try {
        const { status, notes } = req.body;
        
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status, notes },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'record not found' });
        }

        res.json({ message: 'record updated', appointment });
    } catch (error) {
        res.status(500).json({ message: 'err when upd record' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        
        if (!appointment) {
            return res.status(404).json({ message: 'record not found' });
        }

        if (appointment.patientId.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'you dont have permission to delete this record' });
        }

        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: 'record successfully deleted' });
    } catch (error) {
        res.status(500).json({ message: 'err when deleting' });
    }
});

export default router;