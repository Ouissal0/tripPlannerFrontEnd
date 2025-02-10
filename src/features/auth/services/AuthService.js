  import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../models/User';

const API_URL = 'http://172.20.10.7:3000';

class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  // Stockage des données utilisateur
  async setUserData(userData) {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  async getUserData() {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

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
    await AsyncStorage.removeItem('user_data');
  }

  async login(username, password) {
    try {
      const response = await axios.post(`${API_URL}/users/login`, { username, password });
      console.log('Login response:', response.data);
      
      // La réponse contient directement message et user
      const { message, user } = response.data;
      
      if (message === "Login successful" && user) {
        // Stocker les données utilisateur
        await this.setUserData(user);
        
        return {
          success: true,
          message: message,
          data: {
            user: user
          }
        };
      } else {
        return {
          success: false,
          error: message || 'Login failed'
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async signup(userData) {
    try {
      const response = await axios.post(`${API_URL}/users/register`, userData);
      console.log(userData);
      if (response.data.success) {
        await this.setToken(response.data.token);
        return {
          success: true,
          data: response.data
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Registration failed'
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async logout() {
    try {
      // Supprimer les données utilisateur du stockage
      await AsyncStorage.removeItem('userData');
      return {
        success: true,
        message: 'Déconnexion réussie'
      };
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const userData = await this.getUserData();
      if (!userData) return null;
      
      const token = await this.getToken();
      if (!token) return null;

      return userData;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }
}

export default new AuthService();