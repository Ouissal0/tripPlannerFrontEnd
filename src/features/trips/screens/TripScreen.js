import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useToast } from '../../../hooks/useToast';
import TripMap from '../components/TripMap';

const TripScreen = ({ route }) => {
  const { tripId, userId } = route.params || {};
  const showToast = useToast();

  const handleError = (message) => {
    showToast({
      type: 'error',
      message,
      duration: 3000,
    });
  };

  if (!tripId || !userId) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Invalid trip or user information</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <TripMap 
          tripId={tripId} 
          userId={userId}
          onError={handleError}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default TripScreen;
