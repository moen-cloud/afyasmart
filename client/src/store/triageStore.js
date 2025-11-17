import { create } from 'zustand';
import { triageAPI } from '../services/api';

const useTriageStore = create((set) => ({
  triages: [],
  currentTriage: null,
  loading: false,
  error: null,

  // Create triage
  createTriage: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await triageAPI.create(data);
      set({ currentTriage: response.data.triage, loading: false });
      return response.data.triage;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create triage';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Get my triages
  getMyTriages: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await triageAPI.getMyTriages(params);
      set({ triages: response.data.triages, loading: false });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get triages';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Get triage by ID
  getTriageById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await triageAPI.getById(id);
      set({ currentTriage: response.data.triage, loading: false });
      return response.data.triage;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get triage';
      set({ error: errorMessage, loading: false });
      throw new Error(errorMessage);
    }
  },

  // Clear current triage
  clearCurrentTriage: () => set({ currentTriage: null }),

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useTriageStore;