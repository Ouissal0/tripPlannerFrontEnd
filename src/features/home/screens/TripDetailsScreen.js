import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Animated,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius } from '../../../styles/commonStyles';
import { tripService } from '../services/tripService';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.45;
const HEADER_MIN_HEIGHT = 90;

const TripDetailsScreen = ({ route, navigation }) => {
  const { tripData } = route.params;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out my trip to ${tripData.mainDestination}!`,
        title: tripData.title,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderSectionTitle = (title, icon) => (
    <View style={styles.sectionTitleContainer}>
      <Icon name={icon} size={24} color={colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const handleConfirmTrip = async () => {
    try {
      setIsSubmitting(true);
      console.log('Submitting trip data:', tripData);
      const response = await tripService.createTrip(tripData);
      console.log('Trip created successfully:', response);
      Alert.alert(
        'Success',
        'Trip created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('HomeScreen')
          }
        ]
      );
    } catch (error) {
      console.error('Failed to create trip:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create trip. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => setIsSubmitting(false)
          }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTrip = () => {
    navigation.goBack();
  };

  const renderDetailItem = (label, value, icon) => {
    if (value === undefined || value === null) return null;
    
    return (
      <View style={styles.detailItem}>
        <View style={styles.labelContainer}>
          {icon && <Icon name={icon} size={20} color="#2196F3" style={styles.icon} />}
          <Text style={styles.label}>{label}:</Text>
        </View>
        {Array.isArray(value) ? (
          <View style={styles.arrayValue}>
            {value.map((item, index) => (
              <Text key={index} style={styles.value}>
                • {typeof item === 'object' ? JSON.stringify(item) : item}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.value}>
            {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString()}
          </Text>
        )}
      </View>
    );
  };

  if (!tripData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>Trip details not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        {tripData.images?.[0] ? (
          <Animated.Image
            source={{ uri: tripData.images[0] }}
            style={[styles.headerImage, { opacity: imageOpacity }]}
          />
        ) : (
          <Animated.View
            style={[
              styles.headerImage,
              { backgroundColor: colors.primary, opacity: imageOpacity }
            ]}
          />
        )}
        <View style={styles.headerOverlay} />
        
        {/* Header Content */}
        <Animated.View style={[styles.headerContent, { opacity: headerTitleOpacity }]}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {tripData.title}
          </Text>
        </Animated.View>

        {/* Navigation Buttons */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleShare}
          >
            <Icon name="share-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Trip Title Section */}
        <View style={styles.section}>
          <Text style={styles.title}>{tripData.title}</Text>
          <View style={styles.locationRow}>
            <Icon name="location-outline" size={20} color={colors.primary} />
            <Text style={styles.location}>{tripData.mainDestination}</Text>
          </View>
        </View>

        {/* Quick Info Section */}
        <View style={styles.quickInfoSection}>
          <View style={styles.quickInfoItem}>
            <Icon name="calendar-outline" size={24} color={colors.primary} />
            <View style={styles.quickInfoText}>
              <Text style={styles.quickInfoLabel}>Dates</Text>
              <Text style={styles.quickInfoValue}>
                {formatDate(tripData.startDate)} - {formatDate(tripData.endDate)}
              </Text>
            </View>
          </View>

          <View style={styles.quickInfoDivider} />

          <View style={styles.quickInfoItem}>
            <Icon name="wallet-outline" size={24} color={colors.primary} />
            <View style={styles.quickInfoText}>
              <Text style={styles.quickInfoLabel}>Budget</Text>
              <Text style={styles.quickInfoValue}>${tripData.budget}</Text>
            </View>
          </View>
        </View>

        {/* Transport Section */}
        <View style={styles.section}>
          {renderSectionTitle('Transport', 'car-outline')}
          <View style={styles.transportCard}>
            <Icon 
              name={
                tripData.transportMode === 'plane' ? 'airplane' :
                tripData.transportMode === 'train' ? 'train' :
                tripData.transportMode === 'bus' ? 'bus' : 'car'
              }
              size={24}
              color={colors.primary}
            />
            <Text style={styles.transportText}>
              {tripData.transportMode.charAt(0).toUpperCase() + tripData.transportMode.slice(1)}
            </Text>
          </View>
        </View>

        {/* Interests Section */}
        {tripData.interests?.length > 0 && (
          <View style={styles.section}>
            {renderSectionTitle('Interests', 'heart-outline')}
            <View style={styles.interestsContainer}>
              {tripData.interests.map((interest, index) => (
                <View key={index} style={styles.interestChip}>
                  <Icon name="checkmark-circle" size={20} color={colors.primary} />
                  <Text style={styles.interestText}>
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Requirements Section */}
        <View style={styles.section}>
          {renderSectionTitle('Requirements', 'alert-circle-outline')}
          <View style={styles.requirementsContainer}>
            <View style={styles.requirementItem}>
              <Icon 
                name={tripData.visaRequired ? 'checkmark-circle' : 'close-circle'} 
                size={24} 
                color={tripData.visaRequired ? colors.primary : colors.textSecondary} 
              />
              <Text style={styles.requirementText}>Visa Required</Text>
            </View>
            <View style={styles.requirementItem}>
              <Icon 
                name={tripData.insuranceRequired ? 'checkmark-circle' : 'close-circle'} 
                size={24} 
                color={tripData.insuranceRequired ? colors.primary : colors.textSecondary} 
              />
              <Text style={styles.requirementText}>Insurance Required</Text>
            </View>
          </View>
        </View>

        {/* Images Gallery */}
        {tripData.images?.length > 0 && (
          <View style={styles.section}>
            {renderSectionTitle('Gallery', 'images-outline')}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.galleryContainer}
            >
              {tripData.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.galleryImage}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={handleEditTrip}
          >
            <Icon name="create-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit Trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton, isSubmitting && styles.disabledButton]}
            onPress={handleConfirmTrip}
            disabled={isSubmitting}
          >
            <Icon name="checkmark-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Creating...' : 'Confirm Trip'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.m,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.heroOverlay,
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.l,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerButtons: {
    position: 'absolute',
    top: spacing.l,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    marginTop: HEADER_MIN_HEIGHT,
  },
  section: {
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.s,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  quickInfoSection: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    margin: spacing.l,
    padding: spacing.l,
    borderRadius: borderRadius.l,
  },
  quickInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickInfoText: {
    marginLeft: spacing.s,
  },
  quickInfoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  quickInfoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  quickInfoDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.l,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.s,
  },
  transportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: spacing.l,
    borderRadius: borderRadius.l,
  },
  transportText: {
    marginLeft: spacing.m,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.l,
  },
  interestText: {
    marginLeft: spacing.xs,
    color: colors.text,
  },
  requirementsContainer: {
    backgroundColor: colors.backgroundLight,
    padding: spacing.l,
    borderRadius: borderRadius.l,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  requirementText: {
    marginLeft: spacing.s,
    fontSize: 16,
    color: colors.text,
  },
  galleryContainer: {
    marginTop: spacing.s,
  },
  galleryImage: {
    width: width * 0.7,
    height: width * 0.5,
    borderRadius: borderRadius.l,
    marginRight: spacing.m,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.l,
    gap: spacing.m,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.m,
    borderRadius: borderRadius.l,
    gap: spacing.s,
  },
  editButton: {
    backgroundColor: colors.textSecondary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.s,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.xs,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  arrayValue: {
    flex: 1,
  },
});

export default TripDetailsScreen;
