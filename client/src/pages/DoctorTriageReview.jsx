import React, { useState, useEffect } from 'react';
import { Activity, User, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { triageAPI } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { format } from 'date-fns';

const DoctorTriageReview = () => {
  const [triages, setTriages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTriage, setSelectedTriage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [reviewData, setReviewData] = useState({
    doctorNotes: '',
    status: 'reviewed',
  });

  useEffect(() => {
    loadTriages();
  }, [filter]);

  const loadTriages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      const response = await triageAPI.getAll(params);
      setTriages(response.data.triages);
    } catch (error) {
      toast.error('Failed to load triages');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      await triageAPI.review(selectedTriage._id, reviewData);
      toast.success('Triage reviewed successfully');
      setSelectedTriage(null);
      setReviewData({ doctorNotes: '', status: 'reviewed' });
      loadTriages();
    } catch (error) {
      toast.error('Failed to review triage');
    }
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Triage Review</h1>
        <p className="text-gray-600">Review patient triage assessments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'all', label: 'All Triages' },
          { value: 'pending', label: 'Pending Review' },
          { value: 'reviewed', label: 'Reviewed' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Triages List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {triages.length > 0 ? (
          triages.map((triage) => (
            <Card
              key={triage._id}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedTriage(triage)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {triage.patient?.profile?.firstName} {triage.patient?.profile?.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">{triage.patient?.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risk Level:</span>
                  <Badge variant={getRiskColor(triage.assessment.riskLevel)}>
                    {triage.assessment.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Urgency:</span>
                  <Badge variant={triage.assessment.urgency === 'emergency' ? 'danger' : 'info'}>
                    {triage.assessment.urgency.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Symptoms:</span>
                  <span className="text-sm font-medium">{triage.symptoms.length}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500 mt-3">
                  <Calendar className="w-3 h-3 mr-1" />
                  {format(new Date(triage.createdAt), 'MMM dd, yyyy HH:mm')}
                </div>
              </div>

              <div className="mt-4">
                {triage.status === 'pending' ? (
                  <Badge variant="warning">PENDING REVIEW</Badge>
                ) : (
                  <Badge variant="success">REVIEWED</Badge>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Triages Found</h3>
              <p className="text-gray-600">
                {filter === 'all' ? 'No triages to review' : `No ${filter} triages found`}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Triage Detail Modal */}
      {selectedTriage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Triage Assessment Details</h2>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRiskColor(selectedTriage.assessment.riskLevel)}>
                    {selectedTriage.assessment.riskLevel.toUpperCase()}
                  </Badge>
                  <Badge variant={selectedTriage.assessment.urgency === 'emergency' ? 'danger' : 'info'}>
                    {selectedTriage.assessment.urgency.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => setSelectedTriage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Patient Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Patient Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Name:</strong> {selectedTriage.patient?.profile?.firstName}{' '}
                    {selectedTriage.patient?.profile?.lastName}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Email:</strong> {selectedTriage.patient?.email}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Phone:</strong> {selectedTriage.patient?.profile?.phone || 'Not provided'}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Assessment Date:</strong>{' '}
                    {format(new Date(selectedTriage.createdAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              {/* Symptoms */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Reported Symptoms</h3>
                <div className="space-y-2">
                  {selectedTriage.symptoms.map((symptom, idx) => (
                    <div key={idx} className="bg-gray-50 p-3 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{symptom.name}</p>
                        {symptom.description && (
                          <p className="text-sm text-gray-600 mt-1">{symptom.description}</p>
                        )}
                      </div>
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

              {/* Vital Signs */}
              {selectedTriage.vitalSigns && Object.keys(selectedTriage.vitalSigns).length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Vital Signs</h3>
                  <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                    {selectedTriage.vitalSigns.temperature && (
                      <div>
                        <p className="text-sm text-gray-600">Temperature</p>
                        <p className="text-lg font-semibold">{selectedTriage.vitalSigns.temperature}°F</p>
                      </div>
                    )}
                    {selectedTriage.vitalSigns.heartRate && (
                      <div>
                        <p className="text-sm text-gray-600">Heart Rate</p>
                        <p className="text-lg font-semibold">{selectedTriage.vitalSigns.heartRate} bpm</p>
                      </div>
                    )}
                    {selectedTriage.vitalSigns.bloodPressure && (
                      <div>
                        <p className="text-sm text-gray-600">Blood Pressure</p>
                        <p className="text-lg font-semibold">
                          {selectedTriage.vitalSigns.bloodPressure.systolic}/
                          {selectedTriage.vitalSigns.bloodPressure.diastolic}
                        </p>
                      </div>
                    )}
                    {selectedTriage.vitalSigns.oxygenSaturation && (
                      <div>
                        <p className="text-sm text-gray-600">O2 Saturation</p>
                        <p className="text-lg font-semibold">{selectedTriage.vitalSigns.oxygenSaturation}%</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI Assessment */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">AI Assessment</h3>
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Recommendations:</h4>
                  <ul className="space-y-1">
                    {selectedTriage.assessment.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start text-blue-800">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>

                  {selectedTriage.assessment.immediateActions?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-red-900 mb-2">⚠️ Immediate Actions:</h4>
                      <ul className="space-y-1">
                        {selectedTriage.assessment.immediateActions.map((action, idx) => (
                          <li key={idx} className="flex items-start text-red-800">
                            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedTriage.assessment.possibleConditions?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-blue-900 mb-2">Possible Conditions:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedTriage.assessment.possibleConditions.map((condition, idx) => (
                          <Badge key={idx} variant="info">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Previous Review */}
              {selectedTriage.status === 'reviewed' && selectedTriage.doctorNotes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Doctor's Review</h3>
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedTriage.doctorNotes}</p>
                    {selectedTriage.reviewedBy && (
                      <p className="text-sm text-gray-600 mt-2">
                        Reviewed by Dr. {selectedTriage.reviewedBy.profile?.firstName}{' '}
                        {selectedTriage.reviewedBy.profile?.lastName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Review Form */}
              {selectedTriage.status === 'pending' && (
                <form onSubmit={handleReview}>
                  <h3 className="font-semibold text-gray-800 mb-2">Add Your Review</h3>
                  <textarea
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows="4"
                    placeholder="Enter your professional assessment and recommendations..."
                    value={reviewData.doctorNotes}
                    onChange={(e) => setReviewData({ ...reviewData, doctorNotes: e.target.value })}
                    required
                  />
                  <div className="flex justify-end space-x-4 mt-4">
                    <Button type="button" variant="outline" onClick={() => setSelectedTriage(null)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Review
                    </Button>
                  </div>
                </form>
              )}

              {selectedTriage.status === 'reviewed' && (
                <div className="flex justify-end">
                  <Button variant="outline" onClick={() => setSelectedTriage(null)}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorTriageReview;