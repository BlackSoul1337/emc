import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, iin } = req.body;

        if (!email || !password || !iin) {
            return res.status(400).json({ message: 'missing req fields' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { iin }] });
        if (userExists) {
            return res.status(400).json({ message: 'user alr exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phone,
            iin,
            role: 'patient',
            isActivated: false,
            activationLink: uuidv4()
        });

        await newUser.save();
        //emailpotom
        res.status(201).json({ message: 'success' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'serv error' });
    }
});

export default router;