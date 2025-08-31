const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // npm install uuid


const appointmentSchema = new mongoose.Schema({
  // Unique appointment identifier
  appointmentId: {
    type: String,
    unique: true,
    default: () => uuidv4(), // Generates unique IDs like: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
    required: true
  },
  
  // Patient Information
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  patientPhone: {
    type: String,
    trim: true
  },
  
  // Doctor Information
  doctorId: { 
    type: String, 
    required: true 
  },
  doctorName: {
    type: String,
    required: true,
    trim: true
  },
  doctorSpecialty: {
    type: String,
    required: true
  },
  
  // Appointment Details
  appointmentDate: {
    type: String,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  consultationFee: {
    type: Number,
    required: true
  },
  
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['card', 'upi'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  
  // Appointment Status
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
    default: 'scheduled'
  },
  
  // Additional Fields
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);