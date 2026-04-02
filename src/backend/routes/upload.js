import express from 'express';
import multer from 'multer';
import { v2 as cloudinaryV2, default as cloudinaryRoot } from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import Appointment from '../models/Appointment.js';

const router = express.Router();

cloudinaryV2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryAdapter = { v2: cloudinaryV2 };

const avatarStorage = cloudinaryStorage({
    cloudinary: cloudinaryAdapter,
    folder: 'emc_avatars',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    filename: (req, file, cb) => {
        cb(null, `${req.user?.userId || 'unknown'}-${Date.now()}`);
    }
});

const upload = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/avatar', authMiddleware, (req, res, next) => {
    upload.single('avatar')(req, res, (err) => {
        if (err) {
            console.error('Multer error:', err);
            return res.status(400).json({ message: 'File upload error', error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please select the file' });
        }

        const avatarUrl = req.file.secure_url || req.file.url;

        // Delete old avatar from Cloudinary if exists
        const existingUser = await User.findById(req.user.userId).select('avatarUrl');
        if (existingUser?.avatarUrl) {
            try {
                // URL: https://res.cloudinary.com/<cloud>/image/upload/v<ver>/<folder>/<id>.<ext>
                const urlParts = existingUser.avatarUrl.split('/');
                const fileWithExt = urlParts[urlParts.length - 1];
                const folder = urlParts[urlParts.length - 2];
                const publicId = `${folder}/${fileWithExt.split('.')[0]}`;
                await cloudinaryV2.uploader.destroy(publicId);
            } catch (deleteErr) {
                console.warn('Could not delete old avatar:', deleteErr.message);
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            { avatarUrl },
            { returnDocument: 'after' }
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
    cloudinary: cloudinaryAdapter,
    folder: 'emc_lab_results',
    allowedFormats: ['jpg', 'png', 'jpeg', 'pdf', 'webp'],
    filename: (req, file, cb) => {
        cb(null, `result-${req.params.appointmentId}-${Date.now()}`);
    }
});

const uploadLab = multer({ storage: labStorage });

router.post('/lab-result/:appointmentId', authMiddleware, (req, res, next) => {
    uploadLab.single('file')(req, res, (err) => {
        if (err) {
            console.error('Multer lab error:', err);
            return res.status(400).json({ message: 'Lab file upload error', error: err.message });
        }
        next();
    });
}, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Select a file to upload' });
        }

        const fileUrl = req.file.secure_url || req.file.url;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.appointmentId,
            { $push: { files: fileUrl } },
            { returnDocument: 'after' }
        );

        res.json({ message: 'File uploaded successfully', appointment });
    } catch (error) {
        console.error('Lab file upload error:', error);
        res.status(500).json({ message: 'Server error when uploading a file' });
    }
});

export default router;