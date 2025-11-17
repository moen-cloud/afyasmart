import { create } from 'zustand';
import { appointmentAPI } from '../services/api';

const useAppointmentStore = create((set) => ({
  appointments: [],
  doctors: [],
  loading: false,
  error: null,

  // Create appointment
  createAppointment: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await appointmentAPI.create(data);
      set((state) => ({
        appointments: [response.data.appointment, ...state.appointments],
        loading: false,
      }));
      return response.data.appointment;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create appointment';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Get my appointments
  getMyAppointments: async () => {
    set({ loading: true, error: null });
    try {
      const response = await appointmentAPI.getMyAppointments();
      set({ appointments: response.data.appointments, loading: false });
      return response.data.appointments;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get appointments';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Get doctors
  getDoctors: async () => {
    set({ loading: true, error: null });
    try {
      const response = await appointmentAPI.getDoctors();
      set({ doctors: response.data.doctors, loading: false });
      return response.data.doctors;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get doctors';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (id, status, cancellationReason = null) => {
    set({ loading: true, error: null });
    try {
      const response = await appointmentAPI.updateStatus(id, { status, cancellationReason });
      set((state) => ({
        appointments: state.appointments.map((apt) =>
          apt._id === id ? response.data.appointment : apt
        ),
        loading: false,
      }));
      return response.data.appointment;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update appointment';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAppointmentStore;