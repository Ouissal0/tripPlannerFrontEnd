import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MapView, { Marker } from 'react-native-maps';
import { tripService } from '../../../services/tripService';
import { colors, spacing } from '../../../theme';

export const CreateTripScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    title: '',
    mainDestination: '',
    location: null,
    startDate: new Date(),
    endDate: new Date(),
    intermediateStops: [],
    transportMode: '',
    interests: [],
    budget: ''
  });

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [error, setError] = useState('');

  const handleLocationSelect = (event) => {
    const { coordinate } = event.nativeEvent;
    setFormData(prev => ({
      ...prev,
      location: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude
      }
    }));
  };

  const handleDateChange = (event, selectedDate, dateType) => {
    if (dateType === 'start') {
      setShowStartDate(false);
      if (selectedDate) {
        setFormData(prev => ({ ...prev, startDate: selectedDate }));
      }
    } else {
      setShowEndDate(false);
      if (selectedDate) {
        setFormData(prev => ({ ...prev, endDate: selectedDate }));
      }
    }
  };

  const handleInterestAdd = (interest) => {
    if (interest.trim()) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const handleStopAdd = (stop) => {
    if (stop.trim()) {
      setFormData(prev => ({
        ...prev,
        intermediateStops: [...prev.intermediateStops, stop.trim()]
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setError('');
      if (!formData.title || !formData.mainDestination) {
        setError('Title and main destination are required');
        return;
      }

      const trip = await tripService.createTrip(formData);
      navigation.navigate('TripDetails', { tripId: trip.id });
    } catch (err) {
      setError(err.message || 'Error creating trip');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Trip</Text>
      
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Trip Title"
        value={formData.title}
        onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Main Destination"
        value={formData.mainDestination}
        onChangeText={(text) => setFormData(prev => ({ ...prev, mainDestination: text }))}
      />

      <View style={styles.dateContainer}>
        <TouchableOpacity onPress={() => setShowStartDate(true)} style={styles.dateButton}>
          <Text>Start Date: {formData.startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowEndDate(true)} style={styles.dateButton}>
          <Text>End Date: {formData.endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
      </View>

      {showStartDate && (
        <DateTimePicker
          value={formData.startDate}
          mode="date"
          onChange={(event, date) => handleDateChange(event, date, 'start')}
        />
      )}

      {showEndDate && (
        <DateTimePicker
          value={formData.endDate}
          mode="date"
          onChange={(event, date) => handleDateChange(event, date, 'end')}
        />
      )}

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 48.8566,
            longitude: 2.3522,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleLocationSelect}
        >
          {formData.location && (
            <Marker
              coordinate={{
                latitude: formData.location.latitude,
                longitude: formData.location.longitude
              }}
            />
          )}
        </MapView>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Transport Mode"
        value={formData.transportMode}
        onChangeText={(text) => setFormData(prev => ({ ...prev, transportMode: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Budget"
        value={formData.budget}
        keyboardType="numeric"
        onChangeText={(text) => setFormData(prev => ({ ...prev, budget: text }))}
      />

      <TextInput
        style={styles.input}
        placeholder="Add Interest (press enter to add)"
        onSubmitEditing={(event) => handleInterestAdd(event.nativeEvent.text)}
      />

      {formData.interests.length > 0 && (
        <View style={styles.tagContainer}>
          {formData.interests.map((interest, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{interest}</Text>
            </View>
          ))}
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Add Stop (press enter to add)"
        onSubmitEditing={(event) => handleStopAdd(event.nativeEvent.text)}
      />

      {formData.intermediateStops.length > 0 && (
        <View style={styles.tagContainer}>
          {formData.intermediateStops.map((stop, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{stop}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Create Trip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.large,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.small,
    marginBottom: spacing.medium,
    backgroundColor: colors.surface,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.medium,
  },
  dateButton: {
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapContainer: {
    height: 200,
    marginBottom: spacing.medium,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.medium,
  },
  tag: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: spacing.small,
    paddingVertical: 4,
    margin: 4,
  },
  tagText: {
    color: colors.white,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.medium,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: spacing.medium,
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  error: {
    color: colors.error,
    marginBottom: spacing.medium,
  },
});

export default CreateTripScreen;
