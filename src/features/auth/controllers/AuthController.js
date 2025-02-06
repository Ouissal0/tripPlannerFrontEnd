import AuthService from '../services/AuthService';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';

class AuthController {
  constructor() {
    // Ne pas importer AuthService dans le constructeur
  }

  // Méthode pour encoder l'image en base64
  async encodeImageToBase64(imageUri) {
    if (!imageUri) return null;
    try {
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      console.error("Erreur lors de l'encodage de l'image:", error);
      return null;
    }
  }

  async handleLogin(formData) {
    try {
      console.log('handleLogin appelé avec:', formData);
      const response = await AuthService.login(formData.username, formData.password);
      console.log('Réponse du service:', response);

      if (response && response.success) {
        return {
          success: true,
          message: response.message,
          data: {
            user: response.data.user
          }
        };
      } else {
        return {
          success: false,
          error: response.error || 'Échec de la connexion'
        };
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      return {
        success: false,
        error: error.message || 'Une erreur est survenue lors de la connexion'
      };
    }
  }

  async handleSignup(formData, role) {
    try {
      // Encode l'image seulement si elle existe
      let base64Image = null;
      if (formData.profileImage) {
        base64Image = await this.encodeImageToBase64(formData.profileImage);
      }

      const userData = {
        username: formData.userName,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        picture: base64Image,
        phoneNumber: formData.phoneNumber,
        role: role,
      };

      console.log("Données à envoyer:", userData);
  
      const response = await AuthService.signup(userData);
      return response; // AuthService.signup retourne déjà le bon format
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      return {
        success: false,
        error: error.message || "Une erreur est survenue lors de l'inscription"
      };
    }
  }

  async handleLogout() {
    try {
      await AuthService.logout();
      return {
        success: true,
        message: 'Déconnexion réussie'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la déconnexion'
      };
    }
  }

  async checkAuthStatus() {
    try {
      const user = await AuthService.getCurrentUser();
      return {
        isAuthenticated: !!user,
        user
      };
    } catch (error) {
      return {
        isAuthenticated: false,
        user: null
      };
    }
  }

  async handlePasswordReset(email) {
    try {
      if (!this.validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      await AuthService.resetPassword(email);
      return {
        success: true,
        message: 'Password reset email sent'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Password reset failed'
      };
    }
  }

  async handleProfileUpdate(userData) {
    try {
      const validationResult = this.validateProfileData(userData);
      if (!validationResult.isValid) {
        throw new Error(validationResult.error);
      }

      const updatedUser = await AuthService.updateProfile(userData);
      return {
        success: true,
        user: updatedUser,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Profile update failed'
      };
    }
  }

  // Méthodes de validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validateSignupData(data) {
    const { email, password, firstName, lastName, phoneNumber } = data;

    if (!email || !password || !firstName || !lastName) {
      return {
        isValid: false,
        error: 'All required fields must be filled'
      };
    }

    if (!this.validateEmail(email)) {
      return {
        isValid: false,
        error: 'Invalid email format'
      };
    }

    if (password.length < 8) {
      return {
        isValid: false,
        error: 'Password must be at least 8 characters long'
      };
    }

    if (phoneNumber && !this.validatePhoneNumber(phoneNumber)) {
      return {
        isValid: false,
        error: 'Invalid phone number format'
      };
    }

    return {
      isValid: true
    };
  }

  validateProfileData(data) {
    const { firstName, lastName, phoneNumber } = data;

    if (!firstName || !lastName) {
      return {
        isValid: false,
        error: 'First name and last name are required'
      };
    }

    if (phoneNumber && !this.validatePhoneNumber(phoneNumber)) {
      return {
        isValid: false,
        error: 'Invalid phone number format'
      };
    }

    return {
      isValid: true
    };
  }

  validatePhoneNumber(phoneNumber) {
    // Format international simple
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber);
  }
}

export default new AuthController();
