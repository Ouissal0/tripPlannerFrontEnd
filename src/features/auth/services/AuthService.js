  import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../models/User';

const API_URL = 'http://192.168.1.14:3000'; // À remplacer par votre URL d'API
 
class AuthService {
  static instance = null;
  
  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }
  
  constructor() {
    this.token = null;
    this.user = null;
  }    // Gestion du token
  async setToken(token) {
    this.token = token;
    await AsyncStorage.setItem('auth_token', token);
  }

  async getToken() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('auth_token');
    }
    return this.token;
  }

  async removeToken() {
    this.token = null;
    await AsyncStorage.removeItem('auth_token');
  }

  // Requêtes API
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error('Login failed');
      }

      await this.setToken(response.data.token);
      this.user = new User(response.data.user);
      return this.user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async signup(userData) {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);

      if (!response.data.success) {
        throw new Error('Signup failed');
      }

      await this.setToken(response.data.token);
      this.user = new User(response.data.user);
      return this.user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const token = await this.getToken();
      if (token) {
        await axios.post(`${API_URL}/auth/logout`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await this.removeToken();
      this.user = null;
    }
  }

  async getCurrentUser() {
    try {
      const token = await this.getToken();
      if (!token) return null;

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('Failed to get current user');
      }

      this.user = new User(response.data.user);
      return this.user;
    } catch (error) {
      console.error('Get current user error:', error);
      await this.removeToken();
      return null;
    }
  }

  async updateProfile(userData) {
    try {
      const token = await this.getToken();
      const response = await axios.put(`${API_URL}/auth/profile`, userData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        throw new Error('Failed to update profile');
      }

      this.user = new User(response.data.user);
      return this.user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async resetPassword(email) {
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, { email });

      if (!response.data.success) {
        throw new Error('Failed to reset password');
      }

      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  async registerUser(userData) {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async loginUser(username, password) {
    try {
      const response = await axios.post(`${API_URL}/users/login`, { username, password });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserByUsername(username) {
    try {
      const response = await axios.get(`${API_URL}/users/${username}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response) {
      return new Error(error.response.data.message || 'An error occurred');
    }
    return new Error('Network error');
  }
}
export default new AuthService();