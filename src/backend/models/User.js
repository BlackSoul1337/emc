import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['patient', 'doctor', 'admin'], 
        default: 'patient' 
    },
    avatarUrl: { type: String, default: '' },
    firstName: String,
    lastName: String,
    iin: { type: String, unique: true, sparse: true },
    phone: String,
    specialization: { type: String }, 
    experienceYears: { type: Number },
    
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    
    availableSlots: [{ type: Date }]
}, { timestamps: true });

export default mongoose.model('User', userSchema);