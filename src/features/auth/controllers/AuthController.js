import AuthService from '../services/AuthService';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native'; // Ajout de l'import
class AuthController {
  constructor() {
    this.authService = AuthService; // Utilise directement l'instance exportée
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
      // S'assurer que Alert est disponible
     
      return null;
    }
  }

  async handleSignup(formData, role, navigation) {
    try {
      const base64Image = await this.encodeImageToBase64(formData.profileImage);
      
      const userData = {
        username: formData.userName,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        picture: base64Image, // Image encodée en base64
        phoneNumber: formData.phoneNumber,
        role: role,
      };

      console.log("Données à envoyer:", userData);
  
      const response = await this.authService.registerUser(userData);
      if (response.success) {
       // Naviguer vers la page de connexion
      navigation.navigate('LoginScreen'); // Assurez-vous que le nom correspond à celui défini dans votre navigation
  
      } else {
        if (typeof Alert !== 'undefined') {
          Alert.alert('Erreur', response.error);
        } else {
          console.error("Alert n'est pas défini", response.error);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'encodage de l'image:", error);
      if (typeof Alert !== 'undefined') {
        Alert.alert("Erreur", "Impossible d'encoder l'image.");
      } else {
        console.error("Alert n'est pas défini");
      }
    }
  }

  async handleLogin(email, password) {
    try {
      // Validation basique
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!this.validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      // Tentative de connexion
      const user = await this.authService.login(email, password);
      return {
        success: true,
        user,
        message: 'Login successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Login failed'
      };
    }
  }

  

  async handleLogout() {
    try {
      await this.authService.logout();
      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Logout failed'
      };
    }
  }

  async checkAuthStatus() {
    try {
      const user = await this.authService.getCurrentUser();
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

      await this.authService.resetPassword(email);
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

      const updatedUser = await this.authService.updateProfile(userData);
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
