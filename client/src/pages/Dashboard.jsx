import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Calendar, FileText, TrendingUp, Users, Clock } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useTriageStore from '../store/triageStore';
import useAppointmentStore from '../store/appointmentStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { format } from 'date-fns';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { triages, getMyTriages } = useTriageStore();
  const { appointments, getMyAppointments } = useAppointmentStore();
  const [stats, setStats] = useState({
    triages: 0,
    appointments: 0,
    upcomingAppointments: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [triageData, appointmentData] = await Promise.all([
          getMyTriages({ limit: 5 }),
          getMyAppointments(),
        ]);

        const upcoming = appointmentData.filter(
          (apt) => apt.status === 'confirmed' && new Date(apt.appointmentDate) > new Date()
        );

        setStats({
          triages: triageData.pagination?.total || 0,
          appointments: appointmentData.length,
          upcomingAppointments: upcoming.length,
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadData();
  }, []);

  const statCards = [
    {
      title: 'Health Checks',
      value: stats.triages,
      icon: Activity,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Appointments',
      value: stats.appointments,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Upcoming',
      value: stats.upcomingAppointments,
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.profile?.firstName}! 👋
        </h1>
        <p className="text-gray-600 text-lg">Here's your health overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
            onClick={() => navigate('/dashboard/triage')} 
            className="flex items-center justify-center"
          >
            <Activity className="w-5 h-5 mr-2" />
            New Health Check
          </Button>
          <Button 
            onClick={() => navigate('/dashboard/appointments')} 
            variant="success"
            className="flex items-center justify-center"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book Appointment
          </Button>
          <Button 
            onClick={() => navigate('/dashboard/records')} 
            variant="outline"
            className="flex items-center justify-center"
          >
            <FileText className="w-5 h-5 mr-2" />
            View Records
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Triages */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Recent Health Checks</h2>
            <Button size="sm" variant="outline" onClick={() => navigate('/dashboard/triage')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {triages.length > 0 ? (
              triages.slice(0, 3).map((triage) => (
                <div
                  key={triage._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/triage/${triage._id}`)}
                >
                  <div className="flex items-center space-x-3">
                    <Activity className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {triage.symptoms.length} symptom{triage.symptoms.length > 1 ? 's' : ''} assessed
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(triage.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      triage.assessment.riskLevel === 'critical'
                        ? 'danger'
                        : triage.assessment.riskLevel === 'high'
                        ? 'warning'
                        : triage.assessment.riskLevel === 'medium'
                        ? 'info'
                        : 'success'
                    }
                  >
                    {triage.assessment.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No health checks yet</p>
            )}
          </div>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Upcoming Appointments</h2>
            <Button size="sm" variant="outline" onClick={() => navigate('/dashboard/appointments')}>
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {appointments
              .filter((apt) => apt.status === 'confirmed' && new Date(apt.appointmentDate) > new Date())
              .slice(0, 3)
              .map((appointment) => (
                <div
                  key={appointment._id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">
                        Dr. {appointment.doctor?.profile?.firstName} {appointment.doctor?.profile?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')} at {appointment.appointmentTime}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">CONFIRMED</Badge>
                </div>
              ))}
            {appointments.filter((apt) => apt.status === 'confirmed' && new Date(apt.appointmentDate) > new Date())
              .length === 0 && (
              <p className="text-gray-500 text-center py-8">No upcoming appointments</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;