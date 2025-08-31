// server.js - Updated to include appointment routes
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes'); // NEW LINE

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/appointments', appointmentRoutes); // NEW LINE - Same pattern as contact

// MongoDB Connection (removed deprecated options)
mongoose.connect(process.env.MONGODB_URI)  // ✅ CORRECT
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'MediMaga Backend API is running!',
    endpoints: [
      'POST /api/contact/submit - Submit contact form',
      'GET /api/contact/view - View all contacts',
      'POST /api/appointments/book - Book appointment', // NEW
      'GET /api/appointments/view - View all appointments', // NEW
      'GET /api/appointments/patient/:email - View patient appointments' // NEW
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`- Contact Form: POST http://localhost:${PORT}/api/contact/submit`);
  console.log(`- Book Appointment: POST http://localhost:${PORT}/api/appointments/book`); // NEW
  console.log(`- View Appointments: GET http://localhost:${PORT}/api/appointments/view`); // NEW
});