import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Edit, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Badge from '../components/Badge';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    profile: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      phone: user?.profile?.phone || '',
      dateOfBirth: user?.profile?.dateOfBirth || '',
      gender: user?.profile?.gender || '',
      address: {
        street: user?.profile?.address?.street || '',
        city: user?.profile?.address?.city || '',
        state: user?.profile?.address?.state || '',
        country: user?.profile?.address?.country || '',
        zipCode: user?.profile?.address?.zipCode || '',
      },
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        profile: {
          ...formData.profile,
          address: { ...formData.profile.address, [field]: value },
        },
      });
    } else {
      setFormData({
        ...formData,
        profile: { ...formData.profile, [name]: value },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      profile: {
        firstName: user?.profile?.firstName || '',
        lastName: user?.profile?.lastName || '',
        phone: user?.profile?.phone || '',
        dateOfBirth: user?.profile?.dateOfBirth || '',
        gender: user?.profile?.gender || '',
        address: {
          street: user?.profile?.address?.street || '',
          city: user?.profile?.address?.city || '',
          state: user?.profile?.address?.state || '',
          country: user?.profile?.address?.country || '',
          zipCode: user?.profile?.address?.zipCode || '',
        },
      },
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card className="mb-6">
        {/* Profile Header */}
        <div className="flex items-center mb-8 pb-6 border-b">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-6">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {user?.profile?.firstName} {user?.profile?.lastName}
            </h2>
            <p className="text-gray-600 text-lg">{user?.email}</p>
            <div className="mt-2">
              <Badge variant="info" className="text-sm px-3 py-1">
                {user?.role?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  value={formData.profile.firstName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  value={formData.profile.lastName}
                  onChange={handleChange}
                  icon={User}
                  required
                />
              </div>

              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.profile.phone}
                onChange={handleChange}
                icon={Phone}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.profile.dateOfBirth?.split('T')[0] || ''}
                  onChange={handleChange}
                  icon={Calendar}
                />
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.profile.gender}
                  onChange={handleChange}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
                  ]}
                />
              </div>

              <h3 className="text-xl font-semibold text-gray-800 mb-4 mt-6">Address</h3>
              <Input
                label="Street Address"
                name="address.street"
                value={formData.profile.address.street}
                onChange={handleChange}
                icon={MapPin}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="City"
                  name="address.city"
                  value={formData.profile.address.city}
                  onChange={handleChange}
                />
                <Input
                  label="State/Province"
                  name="address.state"
                  value={formData.profile.address.state}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Country"
                  name="address.country"
                  value={formData.profile.address.country}
                  onChange={handleChange}
                />
                <Input
                  label="Zip Code"
                  name="address.zipCode"
                  value={formData.profile.address.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button type="button" variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800 font-medium flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {user?.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  <p className="text-gray-800 font-medium flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {user?.profile?.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                  <p className="text-gray-800 font-medium flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {user?.profile?.dateOfBirth
                      ? new Date(user.profile.dateOfBirth).toLocaleDateString()
                      : 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Gender</p>
                  <p className="text-gray-800 font-medium">{user?.profile?.gender || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {user?.profile?.address && (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Address</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-800 flex items-start">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-1" />
                    <span>
                      {user.profile.address.street && `${user.profile.address.street}, `}
                      {user.profile.address.city && `${user.profile.address.city}, `}
                      {user.profile.address.state && `${user.profile.address.state}, `}
                      {user.profile.address.country && user.profile.address.country}
                      {user.profile.address.zipCode && ` - ${user.profile.address.zipCode}`}
                      {!user.profile.address.street && 'Not provided'}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Account Information */}
      <Card>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">Account Status</p>
              <p className="text-sm text-gray-600">Your account is active</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">Account Type</p>
              <p className="text-sm text-gray-600">You are registered as a {user?.role}</p>
            </div>
            <Badge variant="info">{user?.role}</Badge>
          </div>
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-gray-800">Member Since</p>
              <p className="text-sm text-gray-600">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;