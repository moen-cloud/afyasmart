import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Calendar, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useTriageStore from '../store/triageStore';
import useAppointmentStore from '../store/appointmentStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { format } from 'date-fns';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { triages, getMyTriages } = useTriageStore();
  const { appointments, getMyAppointments } = useAppointmentStore();
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    todayAppointments: 0,
    triagesToReview: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [triageData, appointmentData] = await Promise.all([
          getMyTriages({ limit: 10 }),
          getMyAppointments(),
        ]);

        const today = new Date().toDateString();
        const todayAppts = appointmentData.filter(
          (apt) => new Date(apt.appointmentDate).toDateString() === today
        );

        const pending = appointmentData.filter((apt) => apt.status === 'pending');

        setStats({
          totalAppointments: appointmentData.length,
          pendingAppointments: pending.length,
          todayAppointments: todayAppts.length,
          triagesToReview: triageData.pagination?.total || 0,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, []);

  const statCards = [
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Triages to Review',
      value: stats.triagesToReview,
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

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
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, Dr. {user?.profile?.firstName}! 👨‍⚕️
        </h1>
        <p className="text-gray-600 text-lg">Here's your practice overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => (
          <Card key={idx} className={`bg-gradient-to-br ${stat.color} text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 mb-1 font-medium">{stat.title}</p>
                <h3 className="text-4xl font-bold">{stat.value}</h3>
              </div>
              <div className={`${stat.bgColor} p-4 rounded-full`}>
                <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button 
            onClick={() => navigate('/dashboard/appointments')} 
            className="flex items-center justify-center"
          >
            <Calendar className="w-5 h-5 mr-2" />
            View Appointments
          </Button>
          <Button 
            onClick={() => navigate('/dashboard/patients')} 
            variant="success"
            className="flex items-center justify-center"
          >
            <Users className="w-5 h-5 mr-2" />
            Patient Records
          </Button>
          <Button 
            onClick={() => navigate('/dashboard/triage')} 
            variant="outline"
            className="flex items-center justify-center"
          >
            <Activity className="w-5 h-5 mr-2" />
            Review Triages
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Today's Appointments</h2>
            <Button size="sm" variant="outline" onClick={() => navigate('/dashboard/appointments')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {appointments
              .filter((apt) => new Date(apt.appointmentDate).toDateString() === new Date().toDateString())
              .slice(0, 5)
              .map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate('/dashboard/appointments')}
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {appointment.patient?.profile?.firstName} {appointment.patient?.profile?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {appointment.appointmentTime} - {appointment.type}
                      </p>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(appointment.status)}>
                    {appointment.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            {appointments.filter(
              (apt) => new Date(apt.appointmentDate).toDateString() === new Date().toDateString()
            ).length === 0 && (
              <p className="text-gray-500 text-center py-8">No appointments scheduled for today</p>
            )}
          </div>
        </Card>

        {/* Pending Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Pending Confirmations</h2>
            <Button size="sm" variant="outline" onClick={() => navigate('/dashboard/appointments')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {appointments
              .filter((apt) => apt.status === 'pending')
              .slice(0, 5)
              .map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate('/dashboard/appointments')}
                >
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {appointment.patient?.profile?.firstName} {appointment.patient?.profile?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} at{' '}
                        {appointment.appointmentTime}
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning">PENDING</Badge>
                </div>
              ))}
            {appointments.filter((apt) => apt.status === 'pending').length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-500">All caught up! No pending confirmations</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboard;