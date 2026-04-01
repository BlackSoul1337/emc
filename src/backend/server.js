import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

import User from './models/User.js'
import registerRoutes from './routes/register.js';
import loginRoutes from './routes/login.js';
import authCheckRoutes from './routes/authCheck.js';
import adminRoutes from './routes/admin.js';
import appointmentRoutes from './routes/appointments.js'
import doctorRoutes from './routes/doctors.js'
import uploadRoutes from './routes/upload.js'
import statsRoutes from './routes/stats.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', registerRoutes);
app.use('/api/users', loginRoutes);
app.use('/api/users', authCheckRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes)
app.use('/api/stats', statsRoutes);

// app.post('/api/setup-admin', async (req, res) => {
//     try {
//         const adminExists = await User.findOne({ role: 'admin' });
//         if (adminExists) {
//             return res.status(400).json({ message: 'ADMIN ALR EXISTS' });
//         }

//         const hashedPassword = await bcrypt.hash('admin123', 10);
//         const admin = new User({
//             email: 'admin@emc.kz',
//             password: hashedPassword,
//             firstName: 'Главный',
//             lastName: 'Админ',
//             phone: '+77770000000',
//             iin: '000000000000',
//             role: 'admin',
//             isActivated: true
//         });
        
//         await admin.save();
//         res.status(201).json({ message: 'SUCCESS VICTORY OMG', email: 'admin@emc.kz', password: 'admin123' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

const PORT = process.env.PORT || 3000 || 5000;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('mongodb connected');
        app.listen(PORT, () => {
            console.log(`started on  ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('err bd: ', error.message);
    });