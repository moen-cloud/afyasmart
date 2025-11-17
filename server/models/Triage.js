import mongoose from 'mongoose';

const triageSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: [{
    name: {
      type: String,
      required: true
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      required: true
    },
    duration: String,
    description: String
  }],
  vitalSigns: {
    temperature: Number,
    heartRate: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    respiratoryRate: Number,
    oxygenSaturation: Number
  },
  assessment: {
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    urgency: {
      type: String,
      enum: ['routine', 'urgent', 'emergency'],
      required: true
    },
    recommendations: [String],
    possibleConditions: [String],
    immediateActions: [String]
  },
  additionalNotes: String,
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'completed'],
    default: 'pending'
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  doctorNotes: String
}, {
  timestamps: true
});

triageSchema.index({ patient: 1, createdAt: -1 });
triageSchema.index({ 'assessment.riskLevel': 1, status: 1 });

const Triage = mongoose.model('Triage', triageSchema);

export default Triage;