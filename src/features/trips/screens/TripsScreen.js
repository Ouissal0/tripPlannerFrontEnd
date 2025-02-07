import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius } from '../../../styles/commonStyles';
import { tripService } from '../../home/services/tripService';

const { width, height } = Dimensions.get('window');

const TripsScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const tripsData = await tripService.getTrips();
      setTrips(tripsData);
      
      // Si des voyages sont disponibles, centrer la carte sur le premier voyage
      if (tripsData.length > 0 && tripsData[0].latitude && tripsData[0].longitude) {
        setRegion({
          latitude: tripsData[0].latitude,
          longitude: tripsData[0].longitude,
          latitudeDelta: 5,
          longitudeDelta: 5,
        });
      }
    } catch (error) {
      console.error('Error loading trips:', error);
    }
  };

  const handleTripPress = (trip) => {
    setSelectedTrip(trip);
    if (trip.latitude && trip.longitude) {
      setRegion({
        latitude: trip.latitude,
        longitude: trip.longitude,
        latitudeDelta: 1,
        longitudeDelta: 1,
      });
    }
  };

  const handleMarkerPress = (trip) => {
    navigation.navigate('TripDetails', { tripData: trip });
  };

  const renderTripItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tripCard,
        selectedTrip?.id === item.id && styles.selectedTripCard,
      ]}
      onPress={() => handleTripPress(item)}
    >
      <View style={styles.tripInfo}>
        <Text style={styles.tripTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.tripDetails}>
          <Icon name="location-outline" size={16} color={colors.primary} />
          <Text style={styles.tripLocation} numberOfLines={1}>
            {item.mainDestination}
          </Text>
        </View>
      </View>
      <Icon
        name="chevron-forward"
        size={24}
        color={colors.primary}
        style={styles.arrow}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {trips.map((trip) => (
            trip.latitude && trip.longitude && (
              <Marker
                key={trip.id}
                coordinate={{
                  latitude: trip.latitude,
                  longitude: trip.longitude,
                }}
                onPress={() => handleMarkerPress(trip)}
              >
                <View style={styles.markerContainer}>
                  <Icon name="location" size={30} color={colors.primary} />
                  <View style={styles.markerLabel}>
                    <Text style={styles.markerText} numberOfLines={1}>
                      {trip.title}
                    </Text>
                  </View>
                </View>
              </Marker>
            )
          ))}
        </MapView>
      </View>

      <View style={styles.tripsListContainer}>
        <Text style={styles.sectionTitle}>Mes Voyages</Text>
        <FlatList
          data={trips}
          renderItem={renderTripItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tripsList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  tripsListContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    paddingVertical: spacing.m,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: spacing.l,
    marginBottom: spacing.m,
  },
  tripsList: {
    paddingHorizontal: spacing.l,
  },
  tripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: spacing.m,
    borderRadius: borderRadius.l,
    marginRight: spacing.m,
    width: width * 0.7,
  },
  selectedTripCard: {
    backgroundColor: colors.primary + '20',
    borderColor: colors.primary,
    borderWidth: 1,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  arrow: {
    marginLeft: spacing.m,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerLabel: {
    backgroundColor: colors.white,
    padding: spacing.xs,
    borderRadius: borderRadius.m,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    fontSize: 12,
    color: colors.text,
    maxWidth: 100,
  },
});

export default TripsScreen;
