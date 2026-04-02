import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const avatarStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'emc_avatars',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    filename: (req, file, cb) => {
        cb(undefined, `${req.user.userId}-${Date.now()}`);
    }
});

const upload = multer({ 
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please select the file' });
        }

        const avatarUrl = req.file.path; // Cloudinary returns the full URL in path

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

const labStorage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'emc_lab_results',
    allowedFormats: ['jpg', 'png', 'jpeg', 'pdf', 'webp'],
    filename: (req, file, cb) => {
        cb(undefined, `result-${req.params.appointmentId}-${Date.now()}`);
    }
});

const uploadLab = multer({ storage: labStorage });

router.post('/lab-result/:appointmentId', authMiddleware, uploadLab.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Select a file to upload' });
        }

        const fileUrl = req.file.path;

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