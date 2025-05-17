
import axios from 'axios';
import { toast } from "sonner"; // Using sonner instead of react-hot-toast as it's already in the project

// Create an axios instance with the base URL
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000
});

// Add response interceptor
api.interceptors.response.use(
  response => response, 
  error => {
    if (!error.response) {
      toast.error('Server offline', {
        description: 'Cannot connect to the API server'
      });
    } else {
      toast.error(`Error ${error.response.status}`, {
        description: error.response.data?.message || error.message
      });
    }
    return Promise.reject(error);
  }
);

// Add request interceptor for authentication if needed
api.interceptors.request.use(
  config => {
    // You can add auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
