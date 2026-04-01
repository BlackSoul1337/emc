import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

const uploadDir = 'uploads/avatars';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.userId}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please select the file' });
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { avatarUrl },
            { new: true }
        ).select('-password');

        res.json({ 
            message: 'Avatar uploaded successfully', 
            user: updatedUser 
        });
    } catch (error) {
        console.error('Avatar upload error:', error);
        res.status(500).json({ message: 'Server error when uploading a file' });
    }
});

const labDir = 'uploads/lab-results';
if (!fs.existsSync(labDir)) {
    fs.mkdirSync(labDir, { recursive: true });
}

const labStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, labDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `result-${req.params.appointmentId}-${uniqueSuffix}${ext}`);
    }
});

const uploadLab = multer({ storage: labStorage });

router.post('/lab-result/:appointmentId', authMiddleware, uploadLab.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Select a file to upload' });
        }

        const fileUrl = `/uploads/lab-results/${req.file.filename}`;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.appointmentId,
            { $push: { files: fileUrl } },
            { new: true }
        );

        res.json({ message: 'File uploaded successfully', appointment });
    } catch (error) {
        console.error('Lab file upload error:', error);
        res.status(500).json({ message: 'Server error when uploading a file' });
    }
});

export default router;