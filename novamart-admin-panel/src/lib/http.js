import axios from 'axios';
import Cookies from 'js-cookie';

const http = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to attach the token
http.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Admin Request:', config.method, config.url, config.headers.Authorization ? 'Auth Header Present' : 'No Auth Header');
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Admin Response Error:', error.response?.status, error.response?.data);
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token and redirect to login
      Cookies.remove('token');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default http;
