import React, { useState, useEffect } from 'react';
import { Users, Search, Calendar, FileText, Mail, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppointmentStore from '../store/appointmentStore';
import { recordAPI } from '../services/api';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import { format } from 'date-fns';

const PatientsPage = () => {
  const { appointments, getMyAppointments, loading } = useAppointmentStore();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const appointmentData = await getMyAppointments();
      
      // Extract unique patients from appointments
      const uniquePatientsMap = new Map();
      appointmentData.forEach((apt) => {
        if (apt.patient && !uniquePatientsMap.has(apt.patient._id)) {
          uniquePatientsMap.set(apt.patient._id, {
            ...apt.patient,
            appointmentCount: 1,
            lastAppointment: apt.appointmentDate,
          });
        } else if (apt.patient) {
          const existing = uniquePatientsMap.get(apt.patient._id);
          existing.appointmentCount += 1;
          if (new Date(apt.appointmentDate) > new Date(existing.lastAppointment)) {
            existing.lastAppointment = apt.appointmentDate;
          }
        }
      });

      setPatients(Array.from(uniquePatientsMap.values()));
    } catch (error) {
      toast.error('Failed to load patients');
    }
  };

  const loadPatientRecords = async (patientId) => {
    try {
      setLoadingRecords(true);
      const response = await recordAPI.getPatientRecords(patientId);
      setPatientRecords(response.data.records);
    } catch (error) {
      toast.error('Failed to load patient records');
      setPatientRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    loadPatientRecords(patient._id);
  };

  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${patient.profile?.firstName} ${patient.profile?.lastName}`.toLowerCase();
    const email = patient.email?.toLowerCase() || '';
    return fullName.includes(searchLower) || email.includes(searchLower);
  });

  const patientAppointments = selectedPatient
    ? appointments.filter((apt) => apt.patient?._id === selectedPatient._id)
    : [];

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Patients</h1>
        <p className="text-gray-600">Manage your patient records and appointments</p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <Input
          icon={Search}
          placeholder="Search patients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patients List */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Patients ({filteredPatients.length})
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <div
                    key={patient._id}
                    onClick={() => handleSelectPatient(patient)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedPatient?._id === patient._id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {patient.profile?.firstName?.charAt(0)}
                        {patient.profile?.lastName?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {patient.profile?.firstName} {patient.profile?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{patient.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="info" className="text-xs">
                            {patient.appointmentCount} visits
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No patients found' : 'No patients yet'}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Patient Details */}
        <div className="lg:col-span-2">
          {selectedPatient ? (
            <div className="space-y-6">
              {/* Patient Info Card */}
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                      {selectedPatient.profile?.firstName?.charAt(0)}
                      {selectedPatient.profile?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {selectedPatient.profile?.firstName} {selectedPatient.profile?.lastName}
                      </h2>
                      <p className="text-gray-600">{selectedPatient.email}</p>
                    </div>
                  </div>
                  <Badge variant="success">Active Patient</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedPatient.profile?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      Last Visit: {format(new Date(selectedPatient.lastAppointment), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{selectedPatient.appointmentCount} Total Appointments</span>
                  </div>
                </div>
              </Card>

              {/* Appointments History */}
              <Card>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Appointment History</h3>
                <div className="space-y-3">
                  {patientAppointments.length > 0 ? (
                    patientAppointments
                      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                      .map((apt) => (
                        <div key={apt._id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-gray-800">
                                {format(new Date(apt.appointmentDate), 'MMM dd, yyyy')} at {apt.appointmentTime}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                <strong>Type:</strong> {apt.type}
                              </p>
                              <p className="text-sm text-gray-600">
                                <strong>Reason:</strong> {apt.reason}
                              </p>
                            </div>
                            <Badge
                              variant={
                                apt.status === 'completed'
                                  ? 'success'
                                  : apt.status === 'confirmed'
                                  ? 'info'
                                  : apt.status === 'cancelled'
                                  ? 'danger'
                                  : 'warning'
                              }
                            >
                              {apt.status.toUpperCase()}
                            </Badge>
                          </div>
                          {apt.notes && (
                            <p className="text-sm text-gray-600 mt-2 bg-white p-2 rounded">
                              <strong>Notes:</strong> {apt.notes}
                            </p>
                          )}
                        </div>
                      ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No appointment history</p>
                  )}
                </div>
              </Card>

              {/* Medical Records */}
              <Card>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Medical Records</h3>
                {loadingRecords ? (
                  <Loading />
                ) : patientRecords.length > 0 ? (
                  <div className="space-y-3">
                    {patientRecords.map((record) => (
                      <div key={record._id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-800">{record.title}</p>
                            <p className="text-sm text-gray-600">{record.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {format(new Date(record.date), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <Badge
                            variant={
                              record.recordType === 'diagnosis'
                                ? 'danger'
                                : record.recordType === 'prescription'
                                ? 'success'
                                : 'info'
                            }
                          >
                            {record.recordType.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No medical records available</p>
                )}
              </Card>
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Patient</h3>
                <p className="text-gray-600">Choose a patient from the list to view their details</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientsPage;