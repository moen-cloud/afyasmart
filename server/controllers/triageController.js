import Triage from '../models/Triage.js';
import { assessSymptoms } from '../utils/triageRules.js';

export const createTriage = async (req, res) => {
  try {
    const { symptoms, vitalSigns, additionalNotes } = req.body;
    const patientId = req.user._id;

    const assessment = assessSymptoms(symptoms, vitalSigns);

    const triage = new Triage({
      patient: patientId,
      symptoms,
      vitalSigns,
      assessment,
      additionalNotes
    });

    await triage.save();
    await triage.populate('patient', 'profile email');

    res.status(201).json({
      message: 'Triage assessment completed',
      triage
    });
  } catch (error) {
    console.error('Create triage error:', error);
    res.status(500).json({ message: 'Failed to create triage', error: error.message });
  }
};

export const getMyTriages = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { limit = 10, page = 1 } = req.query;

    const triages = await Triage.find({ patient: patientId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('reviewedBy', 'profile');

    const total = await Triage.countDocuments({ patient: patientId });

    res.json({
      triages,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get my triages error:', error);
    res.status(500).json({ message: 'Failed to get triages', error: error.message });
  }
};

export const getTriageById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const triage = await Triage.findById(id)
      .populate('patient', 'profile email')
      .populate('reviewedBy', 'profile');

    if (!triage) {
      return res.status(404).json({ message: 'Triage not found' });
    }

    if (userRole !== 'doctor' && userRole !== 'admin' && 
        triage.patient._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ triage });
  } catch (error) {
    console.error('Get triage error:', error);
    res.status(500).json({ message: 'Failed to get triage', error: error.message });
  }
};

export const getAllTriages = async (req, res) => {
  try {
    const { status, riskLevel, limit = 20, page = 1 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (riskLevel) query['assessment.riskLevel'] = riskLevel;

    const triages = await Triage.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('patient', 'profile email')
      .populate('reviewedBy', 'profile');

    const total = await Triage.countDocuments(query);

    res.json({
      triages,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all triages error:', error);
    res.status(500).json({ message: 'Failed to get triages', error: error.message });
  }
};

export const reviewTriage = async (req, res) => {
  try {
    const { id } = req.params;
    const { doctorNotes, status } = req.body;
    const doctorId = req.user._id;

    const triage = await Triage.findByIdAndUpdate(
      id,
      {
        reviewedBy: doctorId,
        reviewedAt: new Date(),
        doctorNotes,
        status: status || 'reviewed'
      },
      { new: true }
    ).populate('patient', 'profile email')
     .populate('reviewedBy', 'profile');

    if (!triage) {
      return res.status(404).json({ message: 'Triage not found' });
    }

    res.json({
      message: 'Triage reviewed successfully',
      triage
    });
  } catch (error) {
    console.error('Review triage error:', error);
    res.status(500).json({ message: 'Failed to review triage', error: error.message });
  }
};

export const getTriageStats = async (req, res) => {
  try {
    const [total, byRiskLevel, byStatus, byUrgency] = await Promise.all([
      Triage.countDocuments(),
      Triage.aggregate([
        { $group: { _id: '$assessment.riskLevel', count: { $sum: 1 } } }
      ]),
      Triage.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Triage.aggregate([
        { $group: { _id: '$assessment.urgency', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      total,
      byRiskLevel: Object.fromEntries(byRiskLevel.map(r => [r._id, r.count])),
      byStatus: Object.fromEntries(byStatus.map(s => [s._id, s.count])),
      byUrgency: Object.fromEntries(byUrgency.map(u => [u._id, u.count]))
    });
  } catch (error) {
    console.error('Get triage stats error:', error);
    res.status(500).json({ message: 'Failed to get statistics', error: error.message });
  }
};