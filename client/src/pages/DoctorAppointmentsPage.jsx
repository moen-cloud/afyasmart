import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import useAppointmentStore from '../store/appointmentStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { format } from 'date-fns';

const DoctorAppointmentsPage = () => {
  const { appointments, getMyAppointments, updateAppointmentStatus, loading } = useAppointmentStore();
  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    getMyAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status}`);
      getMyAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      toast.error('Failed to update appointment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'danger',
      completed: 'info',
      'no-show': 'danger',
    };
    return colors[status] || 'default';
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      return new Date(apt.appointmentDate).toDateString() === new Date().toDateString();
    }
    return apt.status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
        <p className="text-gray-600">Manage your patient appointments</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'all', label: 'All Appointments' },
          { value: 'today', label: "Today's Appointments" },
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'completed', label: 'Completed' },
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

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <Card key={appointment._id} hover onClick={() => setSelectedAppointment(appointment)}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {appointment.patient?.profile?.firstName} {appointment.patient?.profile?.lastName}
                    </h3>
                    <p className="text-gray-600 text-sm">{appointment.patient?.email}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.appointmentTime}
                      </span>
                      <Badge variant="info">{appointment.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Reason:</strong> {appointment.reason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={getStatusColor(appointment.status)}>
                    {appointment.status.toUpperCase()}
                  </Badge>
                  {appointment.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(appointment._id, 'confirmed');
                        }}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Cancel this appointment?')) {
                            handleStatusUpdate(appointment._id, 'cancelled', 'Cancelled by doctor');
                          }
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(appointment._id, 'completed');
                      }}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Appointments Found</h3>
              <p className="text-gray-600">
                {filter === 'all'
                  ? 'You have no appointments yet'
                  : `No ${filter} appointments found`}
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Details</h2>
                <Badge variant={getStatusColor(selectedAppointment.status)}>
                  {selectedAppointment.status.toUpperCase()}
                </Badge>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Patient Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Patient Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Name:</strong> {selectedAppointment.patient?.profile?.firstName}{' '}
                    {selectedAppointment.patient?.profile?.lastName}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Email:</strong> {selectedAppointment.patient?.email}
                  </p>
                  <p className="text-gray-700 mt-2">
                    <strong>Phone:</strong> {selectedAppointment.patient?.profile?.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Appointment Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Appointment Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p className="text-gray-700">
                    <strong>Date:</strong>{' '}
                    {format(new Date(selectedAppointment.appointmentDate), 'MMMM dd, yyyy')}
                  </p>
                  <p className="text-gray-700">
                    <strong>Time:</strong> {selectedAppointment.appointmentTime}
                  </p>
                  <p className="text-gray-700">
                    <strong>Type:</strong> {selectedAppointment.type}
                  </p>
                  <p className="text-gray-700">
                    <strong>Duration:</strong> {selectedAppointment.duration || 30} minutes
                  </p>
                  <p className="text-gray-700">
                    <strong>Reason:</strong> {selectedAppointment.reason}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedAppointment.notes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedAppointment.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-4 mt-6">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <Button
                      variant="success"
                      onClick={() => handleStatusUpdate(selectedAppointment._id, 'confirmed')}
                      loading={loading}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Appointment
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (window.confirm('Cancel this appointment?')) {
                          handleStatusUpdate(selectedAppointment._id, 'cancelled', 'Cancelled by doctor');
                        }
                      }}
                    >
                      Cancel Appointment
                    </Button>
                  </>
                )}
                {selectedAppointment.status === 'confirmed' && (
                  <Button
                    variant="success"
                    onClick={() => handleStatusUpdate(selectedAppointment._id, 'completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                  Close
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointmentsPage;