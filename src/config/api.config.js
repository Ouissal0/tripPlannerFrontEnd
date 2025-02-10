import axios from 'axios';

// API configuration
export const API_URL = 'http://172.20.10.7:3000'; // Backend URL

export const SOCKET_URL = 'http://172.20.10.7:3000';

export const MAP_INITIAL_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
