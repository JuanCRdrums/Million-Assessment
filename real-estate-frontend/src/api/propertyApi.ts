import axios from 'axios';
import { Property, PropertyFilter } from '../types/property';

const API_BASE_URL = 'https://localhost:44365/api';

export const propertyApi = {
  async searchProperties(filter: PropertyFilter) {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties`, {
        params: filter
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch properties');
    }
  },

  async getPropertyById(id: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/properties/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch property details');
    }
  }
};