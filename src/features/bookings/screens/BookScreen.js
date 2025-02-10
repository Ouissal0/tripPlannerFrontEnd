import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BookingService from '../services/BookingService';
import { colors, spacing, borderRadius } from '../../../styles/commonStyles';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const BookScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const defaultImage = require('../../../assets/image.png');

  const fetchBookings = async () => {
    try {
      const data = await BookingService.getMyBookings();
      setBookings(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getImageSource = (images) => {
    if (images && images.length > 0) {
      const firstImage = images[0];
      if (firstImage.startsWith('data:image')) {
        return { uri: firstImage };
      } else if (firstImage.startsWith('http')) {
        return { uri: firstImage, cache: 'reload' };
      } else {
        try {
          return { uri: `data:image/jpeg;base64,${firstImage}` };
        } catch (error) {
          return defaultImage;
        }
      }
    }
    return defaultImage;
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return colors.success;
      case 'pending':
        return colors.warning;
      case 'cancelled':
        return colors.error;
      default:
        return colors.text;
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>My Bookings</Text>
          <Text style={styles.subtitle}>Manage your trip reservations</Text>
        </View>
      </View>
    </View>
  );

  const renderBookingCard = ({ item }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => navigation.navigate('TripDetails', { tripData: item.trip })}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={getImageSource(item.trip?.images)}
        style={styles.tripImage}
        imageStyle={styles.tripImageStyle}
        resizeMode="cover"
      >
        <View style={styles.tripOverlay}>
          <View style={styles.tripInfo}>
            <View style={styles.tripHeader}>
              <Text style={styles.tripTitle} numberOfLines={1}>
                {item.trip?.title || 'Unnamed Trip'}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.detailRow}>
                <Icon name="location-outline" size={16} color={colors.white} />
                <Text style={styles.detailText} numberOfLines={1}>
                  {item.trip?.mainDestination || 'Unknown Location'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="calendar-outline" size={16} color={colors.white} />
                <Text style={styles.detailText}>
                  {formatDate(item.trip?.startDate)} - {formatDate(item.trip?.endDate)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Icon name="cash-outline" size={16} color={colors.white} />
                <Text style={styles.detailText}>
                  ${item.trip?.budget || '0'} / person
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                Alert.alert(
                  'Cancel Booking',
                  'Are you sure you want to cancel this booking?',
                  [
                    { text: 'No', style: 'cancel' },
                    {
                      text: 'Yes',
                      onPress: async () => {
                        try {
                          await BookingService.cancelBooking(item.id);
                          fetchBookings();
                          Alert.alert('Success', 'Booking cancelled successfully');
                        } catch (error) {
                          Alert.alert('Error', 'Failed to cancel booking');
                        }
                      },
                    },
                  ]
                );
              }}
            >
              <Icon name="close-circle-outline" size={20} color={colors.white} />
              <Text style={styles.cancelButtonText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={renderBookingCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="calendar-outline" size={64} color={colors.primary} />
            <Text style={styles.emptyText}>No bookings found</Text>
            <Text style={styles.emptySubtext}>
              Your trip bookings will appear here
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: spacing.l,
    backgroundColor: colors.white,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  listContainer: {
    paddingBottom: spacing.l,
  },
  tripCard: {
    marginHorizontal: spacing.l,
    marginTop: spacing.l,
    borderRadius: borderRadius.l,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tripImage: {
    height: 200,
    justifyContent: 'flex-end',
  },
  tripImageStyle: {
    borderRadius: borderRadius.l,
  },
  tripOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: spacing.m,
  },
  tripInfo: {
    gap: spacing.s,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    marginRight: spacing.s,
  },
  statusBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: borderRadius.m,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tripDetails: {
    gap: spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    color: colors.white,
    fontSize: 14,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,59,48,0.4)',
    padding: spacing.s,
    borderRadius: borderRadius.m,
    marginTop: spacing.s,
  },
  cancelButtonText: {
    color: colors.white,
    marginLeft: spacing.xs,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    marginTop: spacing.xxl,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.m,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default BookScreen;
