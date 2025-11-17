import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, AlertCircle, CheckCircle, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import useTriageStore from '../store/triageStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';

const TriagePage = () => {
  const navigate = useNavigate();
  const { createTriage, triages, getMyTriages, loading } = useTriageStore();
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState([]);
  const [newSymptom, setNewSymptom] = useState({ name: '', severity: 'mild', description: '' });
  const [vitalSigns, setVitalSigns] = useState({
    temperature: '',
    heartRate: '',
    bloodPressure: { systolic: '', diastolic: '' },
    oxygenSaturation: '',
  });
  const [result, setResult] = useState(null);

  useEffect(() => {
    getMyTriages();
  }, []);

  const addSymptom = () => {
    if (!newSymptom.name.trim()) {
      toast.error('Please enter a symptom name');
      return;
    }
    setSymptoms([...symptoms, newSymptom]);
    setNewSymptom({ name: '', severity: 'mild', description: '' });
    toast.success('Symptom added');
  };

  const removeSymptom = (index) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (symptoms.length === 0) {
      toast.error('Please add at least one symptom');
      return;
    }

    try {
      const cleanedVitalSigns = {};
      if (vitalSigns.temperature) cleanedVitalSigns.temperature = parseFloat(vitalSigns.temperature);
      if (vitalSigns.heartRate) cleanedVitalSigns.heartRate = parseInt(vitalSigns.heartRate);
      if (vitalSigns.oxygenSaturation) cleanedVitalSigns.oxygenSaturation = parseInt(vitalSigns.oxygenSaturation);
      if (vitalSigns.bloodPressure.systolic && vitalSigns.bloodPressure.diastolic) {
        cleanedVitalSigns.bloodPressure = {
          systolic: parseInt(vitalSigns.bloodPressure.systolic),
          diastolic: parseInt(vitalSigns.bloodPressure.diastolic),
        };
      }

      const triage = await createTriage({
        symptoms,
        vitalSigns: cleanedVitalSigns,
      });

      setResult(triage);
      setStep(3);
      toast.success('Assessment completed');
    } catch (error) {
      toast.error(error.message || 'Failed to create assessment');
    }
  };

  const resetForm = () => {
    setStep(1);
    setSymptoms([]);
    setNewSymptom({ name: '', severity: 'mild', description: '' });
    setVitalSigns({
      temperature: '',
      heartRate: '',
      bloodPressure: { systolic: '', diastolic: '' },
      oxygenSaturation: '',
    });
    setResult(null);
  };

  const getRiskColor = (level) => {
    const colors = {
      low: 'success',
      medium: 'warning',
      high: 'danger',
      critical: 'danger',
    };
    return colors[level] || 'default';
  };

  if (step === 3 && result) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center mb-6">
            <div
              className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                result.assessment.riskLevel === 'critical' || result.assessment.riskLevel === 'high'
                  ? 'bg-red-100'
                  : result.assessment.riskLevel === 'medium'
                  ? 'bg-yellow-100'
                  : 'bg-green-100'
              }`}
            >
              <AlertCircle
                className={`w-10 h-10 ${
                  result.assessment.riskLevel === 'critical' || result.assessment.riskLevel === 'high'
                    ? 'text-red-600'
                    : result.assessment.riskLevel === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Assessment Complete</h2>
            <Badge variant={getRiskColor(result.assessment.riskLevel)} className="text-lg px-4 py-2">
              Risk Level: {result.assessment.riskLevel.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-6">
            {/* Urgency */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Urgency</h3>
              <Badge
                variant={
                  result.assessment.urgency === 'emergency'
                    ? 'danger'
                    : result.assessment.urgency === 'urgent'
                    ? 'warning'
                    : 'info'
                }
                className="text-base px-3 py-2"
              >
                {result.assessment.urgency.toUpperCase()}
              </Badge>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Recommendations</h3>
              <ul className="space-y-2">
                {result.assessment.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Immediate Actions */}
            {result.assessment.immediateActions?.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold text-red-800 mb-3">⚠️ Immediate Actions Required</h3>
                <ul className="space-y-2">
                  {result.assessment.immediateActions.map((action, idx) => (
                    <li key={idx} className="flex items-start">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-red-700 font-medium">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Possible Conditions */}
            {result.assessment.possibleConditions?.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Possible Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {result.assessment.possibleConditions.map((condition, idx) => (
                    <Badge key={idx} variant="info">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Your Symptoms */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Reported Symptoms</h3>
              <div className="space-y-2">
                {result.symptoms.map((symptom, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-800">{symptom.name}</span>
                    <Badge
                      variant={
                        symptom.severity === 'severe'
                          ? 'danger'
                          : symptom.severity === 'moderate'
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {symptom.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={resetForm} className="flex-1">
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
              <Button onClick={() => navigate('/dashboard/appointments')} variant="success" className="flex-1">
                Book Appointment
              </Button>
              <Button onClick={() => navigate('/dashboard')} variant="outline" className="flex-1">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Check</h1>
        <p className="text-gray-600">Answer a few questions to assess your health condition</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2].map((num) => (
          <React.Fragment key={num}>
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold transition-all ${
                step >= num ? 'bg-blue-600 text-white scale-110' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {num}
            </div>
            {num < 2 && (
              <div className={`w-24 h-1 transition-all ${step > num ? 'bg-blue-600' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <Card>
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 1: Tell us your symptoms</h2>

            <div className="mb-6">
              <Input
                label="Symptom Name"
                placeholder="e.g., Fever, Headache, Cough"
                value={newSymptom.name}
                onChange={(e) => setNewSymptom({ ...newSymptom, name: e.target.value })}
              />

              <Select
                label="Severity"
                value={newSymptom.severity}
                onChange={(e) => setNewSymptom({ ...newSymptom, severity: e.target.value })}
                options={[
                  { value: 'mild', label: 'Mild' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'severe', label: 'Severe' },
                ]}
              />

              <Input
                label="Additional Details (Optional)"
                placeholder="Describe your symptom..."
                value={newSymptom.description}
                onChange={(e) => setNewSymptom({ ...newSymptom, description: e.target.value })}
              />

              <Button onClick={addSymptom} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Symptom
              </Button>
            </div>

            {symptoms.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Your Symptoms ({symptoms.length})</h3>
                <div className="space-y-2">
                  {symptoms.map((symptom, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg group hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{symptom.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge
                            variant={
                              symptom.severity === 'severe'
                                ? 'danger'
                                : symptom.severity === 'moderate'
                                ? 'warning'
                                : 'info'
                            }
                          >
                            {symptom.severity}
                          </Badge>
                          {symptom.description && (
                            <span className="text-sm text-gray-500">{symptom.description}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeSymptom(idx)}
                        className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={symptoms.length === 0}>
                Next: Vital Signs
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Step 2: Vital Signs (Optional)</h2>
            <p className="text-gray-600 mb-6">Providing vital signs helps us give you a more accurate assessment</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="number"
                label="Temperature (°F)"
                placeholder="98.6"
                value={vitalSigns.temperature}
                onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: e.target.value })}
              />

              <Input
                type="number"
                label="Heart Rate (bpm)"
                placeholder="70"
                value={vitalSigns.heartRate}
                onChange={(e) => setVitalSigns({ ...vitalSigns, heartRate: e.target.value })}
              />

              <Input
                type="number"
                label="Systolic BP"
                placeholder="120"
                value={vitalSigns.bloodPressure.systolic}
                onChange={(e) =>
                  setVitalSigns({
                    ...vitalSigns,
                    bloodPressure: { ...vitalSigns.bloodPressure, systolic: e.target.value },
                  })
                }
              />

              <Input
                type="number"
                label="Diastolic BP"
                placeholder="80"
                value={vitalSigns.bloodPressure.diastolic}
                onChange={(e) =>
                  setVitalSigns({
                    ...vitalSigns,
                    bloodPressure: { ...vitalSigns.bloodPressure, diastolic: e.target.value },
                  })
                }
              />

              <Input
                type="number"
                label="Oxygen Saturation (%)"
                placeholder="98"
                value={vitalSigns.oxygenSaturation}
                onChange={(e) => setVitalSigns({ ...vitalSigns, oxygenSaturation: e.target.value })}
              />
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleSubmit} loading={loading} variant="success">
                Complete Assessment
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Previous Assessments */}
      {triages.length > 0 && step === 1 && (
        <Card className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Previous Assessments</h2>
          <div className="space-y-3">
            {triages.slice(0, 5).map((triage) => (
              <div
                key={triage._id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => navigate(`/dashboard/triage/${triage._id}`)}
              >
                <div className="flex items-center space-x-3">
                  <Activity className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {triage.symptoms.length} symptom{triage.symptoms.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(triage.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge variant={getRiskColor(triage.assessment.riskLevel)}>
                  {triage.assessment.riskLevel.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TriagePage;