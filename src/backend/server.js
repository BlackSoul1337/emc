import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import registerRoutes from './routes/register.js';
import loginRoutes from './routes/login.js';
import authCheckRoutes from './routes/authCheck.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', registerRoutes);
app.use('/api/users', loginRoutes);
app.use('/api/users', authCheckRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;

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