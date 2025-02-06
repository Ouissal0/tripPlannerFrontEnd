import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing } from '../../../styles/commonStyles';
import AuthService from '../../auth/services/AuthService';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await AuthService.getUserData();
      console.log('User data loaded:', user);
      setUserData(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'map-outline',
      title: 'My Trips',
      onPress: () => navigation.navigate('Trips'),
    },
    {
      icon: 'heart-outline',
      title: 'Favorites',
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      icon: 'help-circle-outline',
      title: 'Help Center',
      onPress: () => navigation.navigate('Help'),
    },
    {
      icon: 'log-out-outline',
      title: 'Sign Out',
      onPress: async () => {
        try {
          await AuthService.logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Auth' }],
          });
        } catch (error) {
          console.error('Error during logout:', error);
        }
      },
    },
  ];

  if (!userData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderUserImage = () => {
    if (userData.picture) {
      return (
        <Image
          source={{ uri: userData.picture }}
          style={styles.profileImage}
        />
      );
    }
    return (
      <View style={styles.profileImagePlaceholder}>
        <Text style={styles.profileImagePlaceholderText}>
          {userData.firstName?.[0]}{userData.lastName?.[0]}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require('../../../assets/imageSignup.png')}
        style={styles.headerBackground}
      >
        <View style={styles.header}>
          {renderUserImage()}
          <Text style={styles.name}>{userData.firstName} {userData.lastName}</Text>
          <Text style={styles.role}>{userData.role}</Text>
        </View>
      </ImageBackground>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Username</Text>
          <Text style={styles.infoValue}>{userData.username}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userData.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{userData.phoneNumber || 'Not provided'}</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Photos</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Icon 
                name={item.icon} 
                size={24} 
                color={item.title === 'Sign Out' ? '#FF6B6B' : colors.text} 
              />
              <Text 
                style={[
                  styles.menuItemText,
                  item.title === 'Sign Out' && styles.signOutText
                ]}
              >
                {item.title}
              </Text>
            </View>
            <Icon 
              name="chevron-forward" 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackground: {
    width: '100%',
    height: 250,
  },
  header: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.white,
    marginBottom: spacing.m,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    borderWidth: 3,
    borderColor: colors.white,
  },
  profileImagePlaceholderText: {
    color: colors.white,
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  role: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  infoSection: {
    padding: spacing.l,
    backgroundColor: colors.white,
    borderRadius: 20,
    marginTop: -20,
    marginHorizontal: spacing.m,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoItem: {
    marginBottom: spacing.m,
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.l,
    backgroundColor: colors.white,
    marginTop: spacing.m,
    marginHorizontal: spacing.m,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuContainer: {
    padding: spacing.m,
    marginTop: spacing.m,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.m,
    backgroundColor: colors.white,
    marginBottom: spacing.s,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: spacing.m,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  signOutText: {
    color: '#FF6B6B',
  },
});

export default ProfileScreen;