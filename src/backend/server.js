import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
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

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: frontendUrl,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/users', registerRoutes);
app.use('/api/users', loginRoutes);
app.use('/api/users', authCheckRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/appointments', appointmentRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/upload', uploadRoutes)
app.use('/api/stats', statsRoutes);

const distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

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