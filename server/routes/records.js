import express from 'express';
import MedicalRecord from '../models/MedicalRecord.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const record = new MedicalRecord({
      ...req.body,
      doctor: req.user._id
    });
    await record.save();
    await record.populate(['patient', 'doctor']);
    res.status(201).json({ message: 'Record created', record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create record', error: error.message });
  }
});

router.get('/patient/:patientId', authenticate, async (req, res) => {
  try {
    const { patientId } = req.params;
    
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    const records = await MedicalRecord.find({ 
      patient: patientId,
      ...(req.user.role === 'patient' && { isPrivate: false })
    })
      .populate('doctor', 'profile')
      .sort({ date: -1 });
    
    res.json({ records });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get records', error: error.message });
  }
});

router.get('/my-records', authenticate, async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patient: req.user._id })
      .populate('doctor', 'profile')
      .sort({ date: -1 });
    
    res.json({ records });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get records', error: error.message });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate(['patient', 'doctor']);
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    if (req.user.role === 'patient' && 
        (record.patient._id.toString() !== req.user._id.toString() || record.isPrivate)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json({ record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get record', error: error.message });
  }
});

router.put('/:id', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate(['patient', 'doctor']);
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record updated', record });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update record', error: error.message });
  }
});

export default router;