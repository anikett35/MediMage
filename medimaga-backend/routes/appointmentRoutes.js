const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

// Book appointment - Similar to your contact form submit
router.post('/book', async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      doctorName,
      doctorSpecialty,
      appointmentDate,
      appointmentTime,
      consultationFee,
      paymentMethod,
      notes
    } = req.body;

    // Validate required fields
    if (!patientName || !patientEmail || !doctorId || !doctorName || !appointmentDate || !appointmentTime || !consultationFee) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields'
      });
    }

    // Create new appointment
    const newAppointment = new Appointment({
      patientName,
      patientEmail,
      patientPhone,
      doctorId,
      doctorName,
      doctorSpecialty,
      appointmentDate,
      appointmentTime,
      consultationFee,
      paymentMethod,
      notes
    });

    // Save to database
    await newAppointment.save();

    // MOCK EMAIL LOGGING (Same pattern as your contact form)
    console.log('=== APPOINTMENT BOOKED ===');
    console.log('Patient:', patientName);
    console.log('Email:', patientEmail);
    console.log('Phone:', patientPhone || 'Not provided');
    console.log('Doctor:', doctorName);
    console.log('Specialty:', doctorSpecialty);
    console.log('Date:', appointmentDate);
    console.log('Time:', appointmentTime);
    console.log('Fee:', `₹${consultationFee}`);
    console.log('Payment Method:', paymentMethod);
    console.log('');
    console.log('📧 MOCK EMAILS THAT WOULD BE SENT:');
    console.log('1. Confirmation email to patient:', patientEmail);
    console.log('2. Notification email to doctor');
    console.log('3. Appointment reminder email');
    console.log('===========================');

    // Return success (same format as your contact form)
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully! Confirmation details sent to your email.',
      appointmentId: newAppointment._id,
      appointmentDetails: {
        doctorName,
        date: appointmentDate,
        time: appointmentTime,
        fee: consultationFee
      }
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.'
    });
  }
});

// GET route to view all appointments
router.get('/view', async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      total: appointments.length,
      appointments: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  }
});

// GET appointments by patient email
router.get('/patient/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const appointments = await Appointment.find({ patientEmail: email }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      total: appointments.length,
      appointments: appointments
    });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  }
});

// UPDATE appointment status
router.patch('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status, notes },
      { new: true }
    );
    
    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment'
    });
  }
});

// DELETE appointment
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    
    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      deletedAppointment: deletedAppointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment'
    });
  }
});
// DELETE route to delete ALL contacts (use carefully!)
router.delete('/delete-all', async (req, res) => {
  try {
    const result = await Appointment.deleteMany({});
    
    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} appointments successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting all appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting appointments'
    });
  }
});

module.exports = router;