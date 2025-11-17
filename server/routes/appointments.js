import express from 'express';
import Appointment from '../models/Appointment.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      patient: req.user._id
    });
    await appointment.save();
    await appointment.populate(['patient', 'doctor']);
    res.status(201).json({ message: 'Appointment created', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
});

router.get('/my-appointments', authenticate, async (req, res) => {
  try {
    const query = req.user.role === 'doctor' 
      ? { doctor: req.user._id }
      : { patient: req.user._id };
    
    const appointments = await Appointment.find(query)
      .populate('patient doctor')
      .sort({ appointmentDate: -1 });
    
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
});

router.get('/doctors', authenticate, async (req, res) => {
  try {
    const User = (await import('../models/User.js')).default;
    const doctors = await User.find({ 
      role: 'doctor', 
      'doctorInfo.isVerified': true,
      isActive: true 
    }).select('profile doctorInfo');
    
    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
});

router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointment.status = status;
    if (status === 'cancelled') {
      appointment.cancelledBy = req.user._id;
      appointment.cancellationReason = cancellationReason;
      appointment.cancelledAt = new Date();
    }
    
    await appointment.save();
    await appointment.populate(['patient', 'doctor']);
    
    res.json({ message: 'Appointment updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
});

router.put('/:id/prescription', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { prescription: req.body, status: 'completed' },
      { new: true }
    ).populate(['patient', 'doctor']);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.json({ message: 'Prescription added', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add prescription', error: error.message });
  }
});

export default router;