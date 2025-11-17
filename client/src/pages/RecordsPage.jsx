import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { recordAPI } from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import { format } from 'date-fns';

const RecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await recordAPI.getMyRecords();
      setRecords(response.data.records);
    } catch (error) {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const getRecordTypeColor = (type) => {
    const colors = {
      diagnosis: 'danger',
      prescription: 'success',
      'lab-result': 'info',
      vaccination: 'purple',
      allergy: 'warning',
      surgery: 'danger',
      note: 'default',
    };
    return colors[type] || 'default';
  };

  const getRecordTypeIcon = (type) => {
    return <FileText className="w-5 h-5" />;
  };

  const filteredRecords = records.filter((record) => {
    if (filter === 'all') return true;
    return record.recordType === filter;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Records</h1>
        <p className="text-gray-600">View and manage your health records</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'all', label: 'All Records' },
          { value: 'diagnosis', label: 'Diagnosis' },
          { value: 'prescription', label: 'Prescriptions' },
          { value: 'lab-result', label: 'Lab Results' },
          { value: 'vaccination', label: 'Vaccinations' },
          { value: 'allergy', label: 'Allergies' },
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

      {/* Records Grid */}
      {filteredRecords.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecords.map((record) => (
            <Card
              key={record._id}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedRecord(record)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg bg-${getRecordTypeColor(record.recordType)}-100`}>
                    {getRecordTypeIcon(record.recordType)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{record.title}</h3>
                    <Badge variant={getRecordTypeColor(record.recordType)}>
                      {record.recordType.replace('-', ' ').toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{record.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {format(new Date(record.date), 'MMM dd, yyyy')}
                </div>
                {record.doctor && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    Dr. {record.doctor.profile?.firstName}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Records Found</h3>
            <p className="text-gray-600">
              {filter === 'all'
                ? 'Your medical records will appear here'
                : `No ${filter.replace('-', ' ')} records found`}
            </p>
          </div>
        </Card>
      )}

      {/* Record Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedRecord.title}</h2>
                <Badge variant={getRecordTypeColor(selectedRecord.recordType)}>
                  {selectedRecord.recordType.replace('-', ' ').toUpperCase()}
                </Badge>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Eye className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{selectedRecord.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Date</h3>
                  <p className="text-gray-600">{format(new Date(selectedRecord.date), 'MMM dd, yyyy')}</p>
                </div>
                {selectedRecord.doctor && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Doctor</h3>
                    <p className="text-gray-600">
                      Dr. {selectedRecord.doctor.profile?.firstName} {selectedRecord.doctor.profile?.lastName}
                    </p>
                  </div>
                )}
              </div>

              {/* Diagnosis Details */}
              {selectedRecord.diagnosis && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Diagnosis</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Condition:</strong> {selectedRecord.diagnosis.condition}
                    </p>
                    {selectedRecord.diagnosis.severity && (
                      <p className="text-gray-700 mt-2">
                        <strong>Severity:</strong> {selectedRecord.diagnosis.severity}
                      </p>
                    )}
                    {selectedRecord.diagnosis.status && (
                      <p className="text-gray-700 mt-2">
                        <strong>Status:</strong> {selectedRecord.diagnosis.status}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Prescription Details */}
              {selectedRecord.prescription?.medications?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Medications</h3>
                  <div className="space-y-3">
                    {selectedRecord.prescription.medications.map((med, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">{med.name}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Dosage:</strong> {med.dosage}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Frequency:</strong> {med.frequency}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>Duration:</strong> {med.duration}
                        </p>
                        {med.instructions && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Instructions:</strong> {med.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Results */}
              {selectedRecord.labResults?.results?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Lab Results</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Parameter</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Value</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Reference</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.labResults.results.map((result, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="px-4 py-2 text-sm text-gray-700">{result.parameter}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">
                              {result.value} {result.unit}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">{result.referenceRange}</td>
                            <td className="px-4 py-2 text-sm">
                              <Badge
                                variant={
                                  result.status === 'normal'
                                    ? 'success'
                                    : result.status === 'abnormal'
                                    ? 'warning'
                                    : 'danger'
                                }
                              >
                                {result.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Vaccination Details */}
              {selectedRecord.vaccination && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Vaccination Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">
                      <strong>Vaccine:</strong> {selectedRecord.vaccination.vaccineName}
                    </p>
                    {selectedRecord.vaccination.doseNumber && (
                      <p className="text-gray-700 mt-2">
                        <strong>Dose:</strong> {selectedRecord.vaccination.doseNumber}
                      </p>
                    )}
                    {selectedRecord.vaccination.nextDueDate && (
                      <p className="text-gray-700 mt-2">
                        <strong>Next Due:</strong>{' '}
                        {format(new Date(selectedRecord.vaccination.nextDueDate), 'MMM dd, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Allergy Details */}
              {selectedRecord.allergy && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Allergy Information</h3>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="text-gray-700">
                      <strong>Allergen:</strong> {selectedRecord.allergy.allergen}
                    </p>
                    <p className="text-gray-700 mt-2">
                      <strong>Reaction:</strong> {selectedRecord.allergy.reaction}
                    </p>
                    {selectedRecord.allergy.severity && (
                      <p className="text-gray-700 mt-2">
                        <strong>Severity:</strong>{' '}
                        <Badge variant="danger">{selectedRecord.allergy.severity}</Badge>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RecordsPage;