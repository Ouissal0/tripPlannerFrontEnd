import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles, { colors, spacing } from '../../../styles/commonStyles';
import AuthController from '../../auth/controllers/AuthController';
import { Picker } from '@react-native-picker/picker';

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
  });
  const [role, setRole] = useState('CLIENT'); // Valeur par défaut

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setFormData({ ...formData, profileImage: result.assets[0].uri });
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const userData = {
      userName: formData.userName,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      password: formData.password,
      profileImage: formData.profileImage,
      role: role,
    };

    const result = await AuthController.handleSignup(userData);
    if (result.success) {
      navigation.navigate('LoginScreen');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.formContainer}>
        {/* Profile Image Picker */}
        <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage}>
          {formData.profileImage ? (
            <Image source={{ uri: formData.profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Icon name="camera" size={40} color={colors.primary} />
              <Text style={styles.imagePlaceholderText}>Add Profile Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Champ de sélection pour le rôle */}
      

        {/* Form Fields */}
        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={formData.userName}
            onChangeText={(text) => setFormData({ ...formData, userName: text })}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="person-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="call-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            keyboardType="phone-pad"
          />
        </View>
        <View style={styles.inputContainer}>
  <Icon name="briefcase-outline" size={20} color={colors.primary} style={styles.inputIcon} />
  <Picker
    selectedValue={role}
    onValueChange={(itemValue) => setRole(itemValue)}
    style={styles.picker} // Ajout d'un style spécifique
  >
    <Picker.Item label="Client" value="CLIENT" />
    <Picker.Item label="Organizer" value="ORGANIZER" />
  </Picker>
</View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Icon name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed-outline" size={20} color={colors.primary} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Icon name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={commonStyles.primaryButton} onPress={handleSignup}>
          <Text style={commonStyles.primaryButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  picker: {
    flex: 1, // Permet au Picker de prendre tout l'espace disponible comme un TextInput
    paddingVertical: spacing.m,
    color: colors.text,
    height: 55, // Ajustement pour qu'il ait la même hauteur
    backgroundColor: colors.white, // Fond blanc comme les autres inputs
  },
  formContainer: {
    flex: 1,
    marginTop: spacing.xl*3,
    padding: spacing.l,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: spacing.l,
    
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.s,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  imagePlaceholderText: {
    color: colors.primary,
    marginTop: spacing.xs,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    backgroundColor: colors.white,
    borderRadius: 25,
    paddingHorizontal: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: spacing.s,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.m,
    color: colors.text,
  },
  eyeIcon: {
    padding: spacing.xs,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.m,
  },
  loginText: {
    color: colors.textSecondary,
  },
  loginLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default SignupScreen;
