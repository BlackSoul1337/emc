import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from './src/backend/models/User.js';
import Appointment from './src/backend/models/Appointment.js';
import Settings from './src/backend/models/Settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, 'src/backend/.env') });

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clean db
        await User.deleteMany({});
        await Appointment.deleteMany({});
        await Settings.deleteMany({});
        console.log('Database cleared!');

        const pass = await bcrypt.hash('123456', 10);

        // Admin
        const admin = new User({ email: 'admin@emc.kz', password: pass, firstName: 'Главный', lastName: 'Админ', phone: '+77770000000', iin: '000000000000', role: 'admin', isActivated: true });
        
        // Doctors
        const d1 = new User({ email: 'doc1@emc.kz', password: pass, firstName: 'Иван', lastName: 'Смирнов', phone: '+77771112233', iin: '111111111111', role: 'doctor', isActivated: true, specialization: 'Кардиолог', experienceYears: 10, availableSlots: [new Date(Date.now() + 86400000).toISOString(), new Date(Date.now() + 172800000).toISOString()] });
        const d2 = new User({ email: 'doc2@emc.kz', password: pass, firstName: 'Анна', lastName: 'Иванова', phone: '+77772223344', iin: '222222222222', role: 'doctor', isActivated: true, specialization: 'Терапевт', experienceYears: 5, availableSlots: [new Date(Date.now() + 86400000).toISOString()] });

        // Patients
        const p1 = new User({ email: 'pat1@emc.kz', password: pass, firstName: 'Сергей', lastName: 'Петров', phone: '+77773334455', iin: '333333333333', role: 'patient', isActivated: true });
        const p2 = new User({ email: 'pat2@emc.kz', password: pass, firstName: 'Мария', lastName: 'Сидорова', phone: '+77774445566', iin: '444444444444', role: 'patient', isActivated: true });

        await User.insertMany([admin, d1, d2, p1, p2]);
        console.log('Users inserted');

        // Appointments
        const a1 = new Appointment({ patientId: p1._id, doctorId: d1._id, date: new Date(), status: 'completed', notes: 'Пациент здоров, рекомендован витамин D.' });
        const a2 = new Appointment({ patientId: p2._id, doctorId: d2._id, date: new Date(Date.now() + 86400000), status: 'scheduled', notes: 'Жалобы на температуру.' });
        
        // Historical Appt for stats
        const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 2);
        const a3 = new Appointment({ patientId: p1._id, doctorId: d2._id, date: weekAgo, status: 'completed', notes: 'Выписан больничный.' });

        await Appointment.insertMany([a1, a2, a3]);
        console.log('Appointments inserted');

        await mongoose.disconnect();
        console.log('Done!');
    } catch (err) {
        console.error('Seeding error:', err);
    }
};

seedDatabase();
