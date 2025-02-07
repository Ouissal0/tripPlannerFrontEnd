import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import LocationService from '../../../services/LocationService';
import SocketService from '../../../services/SocketService';
import { useTheme } from '../../../hooks/useTheme';

const TripMap = ({ tripId, userId, onError }) => {
  const [markers, setMarkers] = useState(new Map());
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    let locationSubscription;
    let isMounted = true;

    const setupLocation = async () => {
      try {
        const hasPermission = await LocationService.requestPermissions();
        if (!hasPermission) {
          onError?.('Location permission is required for this feature');
          return;
        }

        const initialPosition = await LocationService.getCurrentPosition();
        if (initialPosition && isMounted) {
          setCurrentPosition(initialPosition);
          updateUserPosition(initialPosition);
          setIsLoading(false);
        }

        locationSubscription = await LocationService.watchPosition(
          (position) => {
            if (isMounted) {
              setCurrentPosition(position);
              updateUserPosition(position);
            }
          },
          (error) => {
            console.error('Error watching position:', error);
            onError?.('Unable to track location');
          }
        );
      } catch (error) {
        console.error('Setup location error:', error);
        onError?.('Failed to setup location services');
      }
    };

    const setupSocket = async () => {
      try {
        await SocketService.init();
        SocketService.joinTrip(tripId);
        SocketService.onPositionUpdate(handlePositionUpdate);
      } catch (error) {
        console.error('Socket setup error:', error);
        onError?.('Failed to connect to real-time services');
      }
    };

    setupLocation();
    setupSocket();

    return () => {
      isMounted = false;
      if (locationSubscription?.remove) {
        locationSubscription.remove();
      }
      SocketService.leaveTrip(tripId);
      SocketService.disconnect();
    };
  }, [tripId, userId]);

  const updateUserPosition = (position) => {
    SocketService.updatePosition({
      userId,
      tripId,
      latitude: position.latitude,
      longitude: position.longitude,
    });
  };

  const handlePositionUpdate = (data) => {
    setMarkers(prevMarkers => {
      const newMarkers = new Map(prevMarkers);
      newMarkers.set(data.userId, {
        coordinate: {
          latitude: data.position.latitude,
          longitude: data.position.longitude,
        },
        timestamp: data.position.timestamp,
      });
      return newMarkers;
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={currentPosition ? {
          ...currentPosition,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : null}
        showsUserLocation
        showsMyLocationButton
        showsCompass
        toolbarEnabled
      >
        {Array.from(markers.entries()).map(([markerId, markerData]) => (
          <Marker
            key={markerId}
            coordinate={markerData.coordinate}
            title={markerId === userId ? 'You' : `Traveler ${markerId}`}
            description={`Last updated: ${new Date(markerData.timestamp).toLocaleTimeString()}`}
            pinColor={markerId === userId ? theme.colors.primary : theme.colors.secondary}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TripMap;
