import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import commonStyles, { colors } from '../../../styles/commonStyles';
import AuthController from '../../auth/controllers/AuthController';
import { Alert } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const user = await AuthController.handleLogin(email, password);
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainScreen' }],
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView style={commonStyles.scrollView}>
        <View style={commonStyles.heroSection}>
          <ImageBackground
            source={require('../../../assets/imageSignup.png')}
            style={commonStyles.heroImage}
            resizeMode="cover"
          >
            <View style={commonStyles.heroContent}>
              <Text style={commonStyles.heroTitle}>Welcome Back</Text>
              <Text style={commonStyles.heroSubtitle}>
                Sign in to continue your journey
              </Text>
            </View>
          </ImageBackground>
        </View>

        <View style={styles.formSection}>
          <TextInput
            style={[commonStyles.input, styles.input]}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={[commonStyles.input, styles.input]}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[commonStyles.link, styles.forgotPasswordText]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.primaryButton, styles.loginButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text style={commonStyles.primaryButtonText}>Loading...</Text>
            ) : (
              <Text style={commonStyles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          {error && (
            <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
          )}

          <View style={styles.signupContainer}>
            <Text style={commonStyles.linkText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={commonStyles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Onboarding')}
          >
            <Text style={commonStyles.link}>Back to Onboarding</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formSection: {
    padding: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#fea347',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#fea347',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default LoginScreen;
