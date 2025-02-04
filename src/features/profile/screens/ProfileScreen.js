import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles, { colors, spacing } from '../../../styles/commonStyles';
import AuthService from '../../auth/services/AuthService';
import EditProfileScreen from './EditProfileScreen';

const ProfileScreen = ({ navigation }) => {
  const menuItems = [
    {
      icon: 'person-outline',
      title: 'Edit Profile',
      onPress: () => navigation.navigate(EditProfileScreen),
    },
    {
      icon: 'bookmark-outline',
      title: 'My Trips',
      onPress: () => navigation.navigate('Trips'),
    },
    {
      icon: 'heart-outline',
      title: 'Wishlists',
      onPress: () => navigation.navigate('Wishlists'),
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
      title: 'Logout',
      onPress: async () => {
        await AuthService.getInstance().logout();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      },
      danger: true,
    },
  ];

  return (
    <ScrollView style={commonStyles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image
          source={require('../../../assets/image.png')}
          style={styles.profileImage}
        />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.email}>john.doe@example.com</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>48</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Wishlists</Text>
        </View>
      </View>

      {/* Menu Section */}
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
                color={item.danger ? colors.primary : colors.text}
                style={styles.menuIcon}
              />
              <Text
                style={[
                  styles.menuText,
                  item.danger && { color: colors.primary },
                ]}
              >
                {item.title}
              </Text>
            </View>
            <Icon
              name="chevron-forward-outline"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.m,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.l,
    marginVertical: spacing.m,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '50%',
    backgroundColor: colors.border,
  },
  menuContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.s,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: spacing.m,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
  },
});

export default ProfileScreen;
