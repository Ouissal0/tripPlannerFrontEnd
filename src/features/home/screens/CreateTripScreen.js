import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';

const TRANSPORT_MODES = [
  { id: 'car', icon: 'car', label: 'Car' },
  { id: 'plane', icon: 'airplane', label: 'Plane' },
  { id: 'train', icon: 'train', label: 'Train' },
  { id: 'bus', icon: 'bus', label: 'Bus' },
];

const INTERESTS = [
  { id: 'nature', label: 'Nature', icon: 'leaf' },
  { id: 'culture', label: 'Culture', icon: 'book' },
  { id: 'adventure', label: 'Adventure', icon: 'compass' },
  { id: 'relaxation', label: 'Relaxation', icon: 'sunny' },
  { id: 'food', label: 'Food', icon: 'restaurant' },
  { id: 'shopping', label: 'Shopping', icon: 'cart' },
];

// Exemple de destinations populaires pour les suggestions
const POPULAR_DESTINATIONS = [
  'Paris, France',
  'London, UK',
  'New York, USA',
  'Tokyo, Japan',
  'Rome, Italy',
  'Barcelona, Spain',
  'Dubai, UAE',
  'Sydney, Australia',
];

const CreateTripScreen = ({ navigation }) => {
  const [tripData, setTripData] = useState({
    title: '',
    mainDestination: '',
    startDate: new Date(),
    endDate: new Date(),
    intermediateStops: [],
    transportMode: 'car',
    interests: [],
    budget: 1000,
    activities: [],
    companions: [],
  });

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [currentActivity, setCurrentActivity] = useState({
    name: '',
    time: new Date(),
    description: '',
  });
  const [showActivityTime, setShowActivityTime] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [destinationQuery, setDestinationQuery] = useState('');

  const filteredDestinations = POPULAR_DESTINATIONS.filter(destination =>
    destination.toLowerCase().includes(destinationQuery.toLowerCase())
  );

  const selectDestination = (destination) => {
    setTripData(prev => ({ ...prev, mainDestination: destination }));
    setDestinationQuery(destination);
    setShowDestinationSuggestions(false);
  };

  const handleDateChange = (event, selectedDate, dateType) => {
    if (Platform.OS === 'android') {
      setShowStartDate(false);
      setShowEndDate(false);
    }

    if (selectedDate) {
      setTripData(prev => ({
        ...prev,
        [dateType]: selectedDate,
      }));
    }
  };

  const addActivity = () => {
    if (currentActivity.name && currentActivity.description) {
      setTripData(prev => ({
        ...prev,
        activities: [...prev.activities, { ...currentActivity, id: Date.now() }],
      }));
      setCurrentActivity({ name: '', time: new Date(), description: '' });
    }
  };

  const removeActivity = (activityId) => {
    setTripData(prev => ({
      ...prev,
      activities: prev.activities.filter(activity => activity.id !== activityId),
    }));
  };

  const toggleInterest = (interestId) => {
    setTripData(prev => {
      const interests = prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId];
      return { ...prev, interests };
    });
  };

  const addCompanion = (email) => {
    if (email && !tripData.companions.includes(email)) {
      setTripData(prev => ({
        ...prev,
        companions: [...prev.companions, email],
      }));
    }
  };

  const removeCompanion = (email) => {
    setTripData(prev => ({
      ...prev,
      companions: prev.companions.filter(e => e !== email),
    }));
  };

  const handleGenerateItinerary = () => {
    // Validation
    if (!tripData.title || !tripData.mainDestination) {
      alert('Please fill in the required fields (title and destination)');
      return;
    }

    // Navigate to summary screen with all data
    navigation.navigate('TripSummary', { tripData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Trip</Text>
          </View>

          {/* Title Input */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trip Title *</Text>
            <TextInput
              style={styles.input}
              value={tripData.title}
              onChangeText={(text) => setTripData(prev => ({ ...prev, title: text }))}
              placeholder="Enter trip title"
            />
          </View>

          {/* Main Destination */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Main Destination *</Text>
            <View style={styles.destinationContainer}>
              <TextInput
                style={styles.input}
                value={destinationQuery}
                onChangeText={(text) => {
                  setDestinationQuery(text);
                  setShowDestinationSuggestions(true);
                }}
                placeholder="Search destination"
                onFocus={() => setShowDestinationSuggestions(true)}
              />
              {showDestinationSuggestions && destinationQuery.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {filteredDestinations.map((destination) => (
                    <TouchableOpacity
                      key={destination}
                      style={styles.suggestionItem}
                      onPress={() => selectDestination(destination)}
                    >
                      <Icon name="location" size={20} color="#2196F3" />
                      <Text style={styles.suggestionText}>{destination}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Dates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Dates</Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDate(true)}
              >
                <Icon name="calendar" size={20} color="#2196F3" />
                <Text style={styles.dateButtonText}>
                  {tripData.startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              <Text style={styles.dateSeperator}>to</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDate(true)}
              >
                <Icon name="calendar" size={20} color="#2196F3" />
                <Text style={styles.dateButtonText}>
                  {tripData.endDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>
            {(showStartDate || showEndDate) && (
              <DateTimePicker
                value={showStartDate ? tripData.startDate : tripData.endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) =>
                  handleDateChange(
                    event,
                    selectedDate,
                    showStartDate ? 'startDate' : 'endDate'
                  )
                }
              />
            )}
          </View>

          {/* Transport Mode */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transport Mode</Text>
            <View style={styles.transportContainer}>
              {TRANSPORT_MODES.map(mode => (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.transportButton,
                    tripData.transportMode === mode.id && styles.transportButtonActive,
                  ]}
                  onPress={() => setTripData(prev => ({ ...prev, transportMode: mode.id }))}
                >
                  <Icon
                    name={mode.icon}
                    size={24}
                    color={tripData.transportMode === mode.id ? '#fff' : '#2196F3'}
                  />
                  <Text
                    style={[
                      styles.transportText,
                      tripData.transportMode === mode.id && styles.transportTextActive,
                    ]}
                  >
                    {mode.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Interests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interests</Text>
            <View style={styles.interestsContainer}>
              {INTERESTS.map(interest => (
                <TouchableOpacity
                  key={interest.id}
                  style={[
                    styles.interestButton,
                    tripData.interests.includes(interest.id) && styles.interestButtonActive,
                  ]}
                  onPress={() => toggleInterest(interest.id)}
                >
                  <Icon
                    name={interest.icon}
                    size={24}
                    color={tripData.interests.includes(interest.id) ? '#fff' : '#2196F3'}
                  />
                  <Text
                    style={[
                      styles.interestText,
                      tripData.interests.includes(interest.id) && styles.interestTextActive,
                    ]}
                  >
                    {interest.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Budget Estimate</Text>
            <Slider
              style={styles.slider}
              minimumValue={100}
              maximumValue={10000}
              step={100}
              value={tripData.budget}
              onValueChange={(value) =>
                setTripData(prev => ({ ...prev, budget: value }))
              }
              minimumTrackTintColor="#2196F3"
              maximumTrackTintColor="#000000"
            />
            <Text style={styles.budgetText}>
              ${Math.round(tripData.budget).toLocaleString()}
            </Text>
          </View>

          {/* Activities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activities</Text>
            <View style={styles.activityInputContainer}>
              <TextInput
                style={styles.activityInput}
                value={currentActivity.name}
                onChangeText={(text) =>
                  setCurrentActivity(prev => ({ ...prev, name: text }))
                }
                placeholder="Activity name"
              />
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowActivityTime(true)}
              >
                <Icon name="time" size={20} color="#2196F3" />
                <Text style={styles.timeButtonText}>
                  {currentActivity.time.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.activityDescriptionInput}
              value={currentActivity.description}
              onChangeText={(text) =>
                setCurrentActivity(prev => ({ ...prev, description: text }))
              }
              placeholder="Activity description"
              multiline
            />
            <TouchableOpacity style={styles.addButton} onPress={addActivity}>
              <Icon name="add" size={24} color="#fff" />
              <Text style={styles.addButtonText}>Add Activity</Text>
            </TouchableOpacity>

            {/* Activity List */}
            {tripData.activities.map(activity => (
              <View key={activity.id} style={styles.activityItem}>
                <View style={styles.activityItemHeader}>
                  <Text style={styles.activityItemTitle}>{activity.name}</Text>
                  <TouchableOpacity
                    onPress={() => removeActivity(activity.id)}
                    style={styles.removeButton}
                  >
                    <Icon name="close" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.activityItemTime}>
                  {activity.time.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
                <Text style={styles.activityItemDescription}>
                  {activity.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Companions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Travel Companions</Text>
            <View style={styles.companionInputContainer}>
              <TextInput
                style={styles.companionInput}
                placeholder="Enter companion's email"
                onSubmitEditing={(event) => addCompanion(event.nativeEvent.text)}
                returnKeyType="done"
              />
            </View>
            {tripData.companions.map(email => (
              <View key={email} style={styles.companionItem}>
                <Text style={styles.companionEmail}>{email}</Text>
                <TouchableOpacity
                  onPress={() => removeCompanion(email)}
                  style={styles.removeButton}
                >
                  <Icon name="close" size={20} color="#ff6b6b" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleGenerateItinerary}
          >
            <Text style={styles.generateButtonText}>Generate Itinerary</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    flex: 1,
  },
  dateButtonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  dateSeperator: {
    marginHorizontal: 12,
    color: '#666',
  },
  transportContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  transportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
  },
  transportButtonActive: {
    backgroundColor: '#2196F3',
  },
  transportText: {
    marginLeft: 8,
    color: '#2196F3',
  },
  transportTextActive: {
    color: '#fff',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 12,
  },
  interestButtonActive: {
    backgroundColor: '#2196F3',
  },
  interestText: {
    marginLeft: 8,
    color: '#2196F3',
  },
  interestTextActive: {
    color: '#fff',
  },
  slider: {
    height: 40,
  },
  budgetText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
  },
  activityInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  activityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginRight: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  timeButtonText: {
    marginLeft: 8,
  },
  activityDescriptionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  activityItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  activityItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activityItemTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityItemTime: {
    color: '#666',
    marginTop: 4,
  },
  activityItemDescription: {
    marginTop: 8,
  },
  removeButton: {
    padding: 4,
  },
  companionInputContainer: {
    marginBottom: 12,
  },
  companionInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  companionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  companionEmail: {
    fontSize: 16,
  },
  generateButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  destinationContainer: {
    position: 'relative',
    zIndex: 1,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    zIndex: 2,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    marginLeft: 8,
    fontSize: 16,
  },
});

export default CreateTripScreen;
