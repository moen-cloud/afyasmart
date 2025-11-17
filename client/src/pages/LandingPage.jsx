import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Activity, Calendar, MessageCircle, FileText, Shield, ArrowRight } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Activity,
      title: 'Smart Triage',
      description: 'AI-powered symptom assessment for quick health insights',
      color: 'text-blue-600',
    },
    {
      icon: Calendar,
      title: 'Easy Appointments',
      description: 'Book consultations with verified doctors instantly',
      color: 'text-green-600',
    },
    {
      icon: MessageCircle,
      title: 'Real-time Chat',
      description: 'Connect with healthcare professionals anytime',
      color: 'text-purple-600',
    },
    {
      icon: FileText,
      title: 'Medical Records',
      description: 'Securely store and access your health history',
      color: 'text-orange-600',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and completely secure',
      color: 'text-red-600',
    },
    {
      icon: Heart,
      title: 'SDG 3 Aligned',
      description: 'Contributing to Good Health and Well-Being for all',
      color: 'text-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Heart className="w-8 h-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-800">AfyaSmart</span>
        </div>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button onClick={() => navigate('/register')}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8">
            <Heart className="w-24 h-24 text-blue-600 mx-auto animate-pulse-slow" />
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AfyaSmart
          </h1>
          <p className="text-3xl text-gray-700 mb-4 font-semibold">
            Your Virtual Health Companion
          </p>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl">
            Get instant health assessments, connect with doctors, and manage your medical records—all in one secure platform.
          </p>
          <Button size="lg" onClick={() => navigate('/register')} className="mb-4">
            Start Your Health Journey
            <ArrowRight className="w-5 h-5 ml-2 inline" />
          </Button>
          <p className="text-sm text-gray-500">Free to sign up • No credit card required</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
          {features.map((feature, idx) => (
            <Card key={idx} hover className="text-center transform transition-all duration-300">
              <feature.icon className={`w-14 h-14 ${feature.color} mx-auto mb-4`} />
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center">
          <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to take control of your health?</h2>
            <p className="text-xl mb-6 text-blue-100">
              Join thousands of users who trust AfyaSmart for their healthcare needs
            </p>
            <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
              Create Free Account
            </Button>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>&copy; 2024 AfyaSmart. All rights reserved.</p>
          <p className="mt-2">Supporting SDG 3: Good Health and Well-Being</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;