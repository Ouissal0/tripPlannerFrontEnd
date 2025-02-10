import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles, { colors, spacing } from '../../../styles/commonStyles';

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: false,
    darkMode: false,
    locationServices: true,
  });

  const settingsSections = [
    {
      title: 'App Settings',
      items: [
        {
          icon: 'notifications-outline',
          title: 'Push Notifications',
          type: 'switch',
          key: 'notifications',
        },
        {
          icon: 'mail-outline',
          title: 'Email Updates',
          type: 'switch',
          key: 'emailUpdates',
        },
        {
          icon: 'moon-outline',
          title: 'Dark Mode',
          type: 'switch',
          key: 'darkMode',
        },
        {
          icon: 'location-outline',
          title: 'Location Services',
          type: 'switch',
          key: 'locationServices',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: 'lock-closed-outline',
          title: 'Change Password',
          type: 'button',
          onPress: () => navigation.navigate('ChangePassword'),
        },
        {
          icon: 'shield-outline',
          title: 'Privacy Settings',
          type: 'button',
          onPress: () => navigation.navigate('Privacy'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: 'help-circle-outline',
          title: 'Help Center',
          type: 'button',
          onPress: () => navigation.navigate('Help'),
        },
        {
          icon: 'document-text-outline',
          title: 'Terms of Service',
          type: 'button',
          onPress: () => navigation.navigate('Terms'),
        },
        {
          icon: 'shield-checkmark-outline',
          title: 'Privacy Policy',
          type: 'button',
          onPress: () => navigation.navigate('Privacy'),
        },
      ],
    },
    {
      title: 'Danger Zone',
      items: [
        {
          icon: 'trash-outline',
          title: 'Delete Account',
          type: 'button',
          danger: true,
          onPress: () => {
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account? This action cannot be undone.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    // Handle account deletion
                  },
                },
              ]
            );
          },
        },
      ],
    },
  ];

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const renderSettingItem = (item) => {
    return (
      <View
        key={item.title}
        style={[
          styles.settingItem,
          item.danger && styles.dangerItem,
        ]}
      >
        <View style={styles.settingItemLeft}>
          <Icon
            name={item.icon}
            size={24}
            color={item.danger ? colors.primary : colors.text}
            style={styles.settingIcon}
          />
          <Text
            style={[
              styles.settingText,
              item.danger && styles.dangerText,
            ]}
          >
            {item.title}
          </Text>
        </View>
        {item.type === 'switch' ? (
          <Switch
            value={settings[item.key]}
            onValueChange={(value) => handleSettingChange(item.key, value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        ) : (
          <TouchableOpacity onPress={item.onPress}>
            <Icon
              name="chevron-forward-outline"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={commonStyles.container}>
      {settingsSections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map(renderSettingItem)}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginLeft: spacing.l,
    marginBottom: spacing.s,
  },
  sectionContent: {
    backgroundColor: colors.white,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: spacing.m,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    color: colors.primary,
  },
});

export default SettingsScreen;
