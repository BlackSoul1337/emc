import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, link) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject: 'emc Account Activation',
            html: `<div><h2>Welcome to Electronic Medical Cards!</h2><p>Click here to activate your account:</p><a href="${link}">${link}</a></div>`
        });
    } catch (e) {
        console.error('Email not sent:', e.message);
        console.log('--- ACTIVATION LINK:', link);
    }
};

router.post('/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone, iin } = req.body;

        if (!email || !password || !iin) return res.status(400).json({ message: 'missing req fields' });

        const userExists = await User.findOne({ $or:[{ email }, { iin }] });
        if (userExists) return res.status(400).json({ message: 'user alr exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const activationLink = uuidv4();

        const newUser = new User({
            email, password: hashedPassword, firstName, lastName, phone, iin, 
            role: 'patient', isActivated: false, activationLink
        });

        await newUser.save();

        const backendUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3000}`;
        const link = `${backendUrl}/api/users/activate/${activationLink}`;
        await sendEmail(email, link);

        res.status(201).json({ message: 'success' });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'serv error' });
    }
});

router.get('/activate/:link', async (req, res) => {
    try {
        const user = await User.findOne({ activationLink: req.params.link });
        if (!user) return res.status(400).send('Invalid or expired activation link');
        
        user.isActivated = true;
        await user.save();
        
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login?activated=true`);
    } catch (error) {
        res.status(500).send('Activation error');
    }
});

export default router;