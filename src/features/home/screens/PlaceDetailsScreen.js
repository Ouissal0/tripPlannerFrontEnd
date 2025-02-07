import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius } from '../../../styles/commonStyles';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.5;

const PlaceDetailsScreen = ({ route, navigation }) => {
  const { tripData } = route.params;
  const defaultImage = require('../../../assets/image.png');
  const scrollY = new Animated.Value(0);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const getImageSource = () => {
    if (tripData.images && tripData.images.length > 0) {
      const firstImage = tripData.images[0];
      if (firstImage.startsWith('data:image')) {
        return { uri: firstImage };
      } else if (firstImage.startsWith('http')) {
        return { uri: firstImage };
      } else {
        try {
          return { uri: `data:image/jpeg;base64,${firstImage}` };
        } catch (error) {
          console.error('Error processing image:', error);
          return defaultImage;
        }
      }
    }
    return defaultImage;
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      
      {/* Header Image */}
      <Animated.View
        style={[
          styles.header,
          { transform: [{ translateY: headerTranslateY }] },
        ]}
      >
        <Animated.Image
          source={getImageSource()}
          style={[styles.headerImage, { opacity: imageOpacity }]}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay} />
      </Animated.View>

      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton}>
        <Icon name="share-social" size={24} color="#fff" />
      </TouchableOpacity>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.contentContainer}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{tripData.title}</Text>
            <View style={styles.locationRow}>
              <Icon name="location" size={20} color={colors.primary} />
              <Text style={styles.location}>{tripData.mainDestination}</Text>
            </View>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfoContainer}>
            <View style={styles.quickInfoItem}>
              <Icon name="calendar-outline" size={24} color={colors.primary} />
              <View style={styles.quickInfoText}>
                <Text style={styles.quickInfoLabel}>Dates</Text>
                <Text style={styles.quickInfoValue}>
                  {new Date(tripData.startDate).toLocaleDateString()} - {new Date(tripData.endDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.quickInfoItem}>
              <Icon name="people-outline" size={24} color={colors.primary} />
              <View style={styles.quickInfoText}>
                <Text style={styles.quickInfoLabel}>Group Size</Text>
                <Text style={styles.quickInfoValue}>
                  {tripData.maxParticipants || 'Unlimited'} people
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this trip</Text>
            <Text style={styles.description}>
              {tripData.description || 'No description available.'}
            </Text>
          </View>

          {/* Trip Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailCard}>
                <Icon name="cash-outline" size={28} color={colors.primary} />
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>{tripData.budget || 'Not specified'}</Text>
              </View>
              <View style={styles.detailCard}>
                <Icon name="map-outline" size={28} color={colors.primary} />
                <Text style={styles.detailLabel}>Activities</Text>
                <Text style={styles.detailValue}>{tripData.activities?.length || 0}</Text>
              </View>
              <View style={styles.detailCard}>
                <Icon name="time-outline" size={28} color={colors.primary} />
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>
                  {Math.ceil((new Date(tripData.endDate) - new Date(tripData.startDate)) / (1000 * 60 * 60 * 24))} days
                </Text>
              </View>
              <View style={styles.detailCard}>
                <Icon name="heart-outline" size={28} color={colors.primary} />
                <Text style={styles.detailLabel}>Interest</Text>
                <Text style={styles.detailValue}>High</Text>
              </View>
            </View>
          </View>

          {/* Spacing for bottom button */}
          <View style={{ height: 100 }} />
        </View>
      </Animated.ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>Join this Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: HEADER_HEIGHT,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.heroOverlay,
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + spacing.m,
    left: spacing.l,
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  shareButton: {
    position: 'absolute',
    top: StatusBar.currentHeight + spacing.m,
    right: spacing.l,
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  contentContainer: {
    marginTop: HEADER_HEIGHT - 30,
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.l,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
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
  quickInfoContainer: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.l,
    padding: spacing.l,
    marginBottom: spacing.xl,
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
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.l,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.l,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.l,
  },
  detailCard: {
    width: (width - spacing.l * 3) / 2,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.l,
    padding: spacing.l,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.s,
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  joinButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.l,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  joinButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlaceDetailsScreen;