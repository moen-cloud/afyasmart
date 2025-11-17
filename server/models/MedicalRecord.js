import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recordType: {
    type: String,
    enum: ['diagnosis', 'prescription', 'lab-result', 'vaccination', 'allergy', 'surgery', 'note'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  relatedAppointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  },
  diagnosis: {
    condition: String,
    icdCode: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical']
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic']
    }
  },
  prescription: {
    medications: [{
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
      startDate: Date,
      endDate: Date,
      instructions: String
    }]
  },
  labResults: {
    testName: String,
    results: [{
      parameter: String,
      value: String,
      unit: String,
      referenceRange: String,
      status: {
        type: String,
        enum: ['normal', 'abnormal', 'critical']
      }
    }],
    conclusion: String
  },
  vaccination: {
    vaccineName: String,
    doseNumber: Number,
    batchNumber: String,
    nextDueDate: Date
  },
  allergy: {
    allergen: String,
    reaction: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'life-threatening']
    }
  },
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

medicalRecordSchema.index({ patient: 1, date: -1 });
medicalRecordSchema.index({ recordType: 1, patient: 1 });
medicalRecordSchema.index({ doctor: 1, date: -1 });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

export default MedicalRecord;