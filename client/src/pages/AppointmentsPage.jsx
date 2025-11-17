import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Plus, X, Stethoscope, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppointmentStore from '../store/appointmentStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';
import { format } from 'date-fns';

const AppointmentsPage = () => {
  const { appointments, doctors, getMyAppointments, getDoctors, createAppointment, updateAppointmentStatus, loading } =
    useAppointmentStore();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    doctor: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    type: 'consultation',
  });

  useEffect(() => {
    getMyAppointments();
    getDoctors();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // If doctor is selected, show doctor details
    if (e.target.name === 'doctor') {
      const doctor = doctors.find(d => d._id === e.target.value);
      setSelectedDoctor(doctor);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAppointment(formData);
      toast.success('Appointment booked successfully!');
      setShowBookingForm(false);
      setSelectedDoctor(null);
      setFormData({
        doctor: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        type: 'consultation',
      });
      getMyAppointments();
    } catch (error) {
      toast.error(error.message || 'Failed to book appointment');
    }
  };

  const handleCancelAppointment = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await updateAppointmentStatus(id, 'cancelled', 'Cancelled by patient');
        toast.success('Appointment cancelled');
        getMyAppointments();
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'info',
    };
    return colors[status] || 'default';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointments</h1>
          <p className="text-gray-600">Manage your medical consultations</p>
        </div>
        <Button onClick={() => setShowBookingForm(!showBookingForm)}>
          {showBookingForm ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Book Appointment
            </>
          )}
        </Button>
      </div>

      {/* Booking Form */}
      {showBookingForm && (
        <Card className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Book New Appointment</h2>
          
          {/* Available Doctors Section */}
          {doctors.length > 0 && !formData.doctor && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Doctors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {doctors.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => {
                      setFormData({ ...formData, doctor: doc._id });
                      setSelectedDoctor(doc);
                    }}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-all hover:shadow-md"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {doc.profile.firstName.charAt(0)}{doc.profile.lastName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800 text-lg">
                          Dr. {doc.profile.firstName} {doc.profile.lastName}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Stethoscope className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-600">
                            {doc.doctorInfo?.specialization || 'General Practitioner'}
                          </span>
                        </div>
                        {doc.doctorInfo?.yearsOfExperience && (
                          <div className="flex items-center space-x-2 mt-1">
                            <Award className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-gray-600">
                              {doc.doctorInfo.yearsOfExperience} years experience
                            </span>
                          </div>
                        )}
                        {doc.doctorInfo?.isVerified && (
                          <Badge variant="success" className="mt-2">VERIFIED</Badge>
                        )}
                        {doc.doctorInfo?.bio && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{doc.doctorInfo.bio}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Doctor Info */}
          {selectedDoctor && (
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedDoctor.profile.firstName.charAt(0)}{selectedDoctor.profile.lastName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      Selected: Dr. {selectedDoctor.profile.firstName} {selectedDoctor.profile.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{selectedDoctor.doctorInfo?.specialization}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setFormData({ ...formData, doctor: '' });
                    setSelectedDoctor(null);
                  }}
                >
                  Change Doctor
                </Button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Manual Doctor Selection (if they skip the cards) */}
            {!selectedDoctor && (
              <Select
                label="Or Select Doctor from List"
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                options={doctors.map((doc) => ({
                  value: doc._id,
                  label: `Dr. ${doc.profile.firstName} ${doc.profile.lastName} - ${doc.doctorInfo?.specialization || 'General'}`,
                }))}
                required
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Appointment Date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <Input
                type="time"
                label="Appointment Time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
              />
            </div>

            <Select
              label="Appointment Type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              options={[
                { value: 'consultation', label: 'Consultation' },
                { value: 'follow-up', label: 'Follow-up' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'routine-checkup', label: 'Routine Checkup' },
              ]}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Visit *
              </label>
              <textarea
                name="reason"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all border-gray-300"
                rows="3"
                placeholder="Please describe your reason for consultation..."
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => {
                setShowBookingForm(false);
                setSelectedDoctor(null);
              }}>
                Cancel
              </Button>
              <Button type="submit" loading={loading} disabled={!formData.doctor}>
                Book Appointment
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Card key={appointment._id} hover>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Dr. {appointment.doctor?.profile?.firstName} {appointment.doctor?.profile?.lastName}
                    </h3>
                    <p className="text-gray-600">{appointment.doctor?.doctorInfo?.specialization}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.appointmentTime}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={getStatusColor(appointment.status)}>{appointment.status.toUpperCase()}</Badge>
                  {appointment.status === 'pending' || appointment.status === 'confirmed' ? (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleCancelAppointment(appointment._id)}
                    >
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Appointments Yet</h3>
              <p className="text-gray-600 mb-6">Book your first consultation with a doctor</p>
              <Button onClick={() => setShowBookingForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;