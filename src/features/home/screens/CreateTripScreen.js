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
  Switch,
  StatusBar,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';
import ImagePickerComponent from '../../../components/ImagePicker';
import { colors, spacing, borderRadius } from '../../../styles/commonStyles';

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

const ACCOMMODATION_TYPES = [
  { id: 'hotel', icon: 'bed', label: 'Hotel' },
  { id: 'apartment', icon: 'home', label: 'Apartment' },
  { id: 'hostel', icon: 'people', label: 'Hostel' },
  { id: 'resort', icon: 'umbrella', label: 'Resort' },
  { id: 'camping', icon: 'bonfire', label: 'Camping' },
];

const MEAL_PREFERENCES = [
  { id: 'any', label: 'Any', icon: 'restaurant' },
  { id: 'vegetarian', label: 'Vegetarian', icon: 'leaf' },
  { id: 'vegan', label: 'Vegan', icon: 'nutrition' },
  { id: 'halal', label: 'Halal', icon: 'moon' },
  { id: 'kosher', label: 'Kosher', icon: 'star' },
];

const LANGUAGES = [
  { id: 'english', label: 'English', icon: 'language' },
  { id: 'french', label: 'French', icon: 'language' },
  { id: 'spanish', label: 'Spanish', icon: 'language' },
  { id: 'arabic', label: 'Arabic', icon: 'language' },
  { id: 'chinese', label: 'Chinese', icon: 'language' },
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
    accommodationType: 'hotel',
    accommodationBudget: 200,
    mealPreferences: [],
    insuranceRequired: false,
    visaRequired: false,
    languages: [],
    numberOfTravelers: 1,
    specialRequirements: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
    images: [], 
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
  const [currentCompanion, setCurrentCompanion] = useState('');

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

  const handleSubmit = async () => {
    try {
      const formData = {
        title: tripData.title,
        mainDestination: tripData.mainDestination,
        startDate: tripData.startDate.toISOString(),
        endDate: tripData.endDate.toISOString(),
        intermediateStops: tripData.intermediateStops,
        transportMode: tripData.transportMode,
        interests: tripData.interests,
        budget: parseFloat(tripData.budget),
        activities: tripData.activities.map(activity => ({
          ...activity,
          time: activity.time.toISOString()
        })),
        companions: tripData.companions,
        accommodationType: tripData.accommodationType,
        accommodationBudget: parseFloat(tripData.accommodationBudget),
        mealPreferences: tripData.mealPreferences,
        insuranceRequired: tripData.insuranceRequired,
        visaRequired: tripData.visaRequired,
        languages: tripData.languages,
        numberOfTravelers: parseInt(tripData.numberOfTravelers),
        specialRequirements: tripData.specialRequirements,
        emergencyContact: tripData.emergencyContact,
        images: tripData.images.map(img => img.base64)
      };

      if (!formData.title) {
        throw new Error('Title is required');
      }
      if (!formData.mainDestination) {
        throw new Error('Main destination is required');
      }

      navigation.navigate('TripDetails', { tripData: formData });
    } catch (error) {
      console.error('Error formatting trip data:', error);
      Alert.alert('Error', error.message || 'Failed to prepare trip data');
    }
  };

  const handleGenerateItinerary = () => {
    handleSubmit();
  };

  const renderSectionTitle = (title, icon) => (
    <View style={styles.sectionTitleContainer}>
      <Icon name={icon} size={24} color={colors.primary} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const renderChipSelection = (items, selectedItems, onSelect, multiple = true) => (
    <View style={styles.chipContainer}>
      {items.map((item) => {
        const isSelected = multiple 
          ? selectedItems.includes(item.id)
          : selectedItems === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.chip,
              isSelected && styles.chipSelected,
            ]}
            onPress={() => onSelect(item.id)}
          >
            <Icon 
              name={item.icon} 
              size={20} 
              color={isSelected ? colors.white : colors.primary}
            />
            <Text style={[
              styles.chipText,
              isSelected && styles.chipTextSelected,
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Trip</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            {renderSectionTitle('Basic Information', 'information-circle-outline')}
            
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Trip Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Give your trip a catchy name"
                value={tripData.title}
                onChangeText={(text) => setTripData({ ...tripData, title: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Destination</Text>
              <TextInput
                style={styles.input}
                placeholder="Where are you going?"
                value={tripData.mainDestination}
                onChangeText={(text) => setTripData({ ...tripData, mainDestination: text })}
              />
              {tripData.mainDestination.length > 0 && (
                <FlatList
                  data={POPULAR_DESTINATIONS.filter(dest =>
                    dest.toLowerCase().includes(tripData.mainDestination.toLowerCase())
                  )}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => setTripData({ ...tripData, mainDestination: item })}
                    >
                      <Icon name="location-outline" size={20} color={colors.primary} />
                      <Text style={styles.suggestionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={item => item}
                  style={styles.suggestionsList}
                />
              )}
            </View>

            <View style={styles.dateContainer}>
              <View style={styles.dateInput}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowStartDate(true)}
                >
                  <Icon name="calendar-outline" size={20} color={colors.primary} />
                  <Text style={styles.dateText}>
                    {tripData.startDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.dateInput}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowEndDate(true)}
                >
                  <Icon name="calendar-outline" size={20} color={colors.primary} />
                  <Text style={styles.dateText}>
                    {tripData.endDate.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            {renderSectionTitle('Transport', 'car-outline')}
            {renderChipSelection(
              TRANSPORT_MODES,
              tripData.transportMode,
              (mode) => setTripData({ ...tripData, transportMode: mode }),
              false
            )}
          </View>

          <View style={styles.section}>
            {renderSectionTitle('Interests', 'heart-outline')}
            {renderChipSelection(
              INTERESTS,
              tripData.interests,
              (interest) => {
                const newInterests = tripData.interests.includes(interest)
                  ? tripData.interests.filter(i => i !== interest)
                  : [...tripData.interests, interest];
                setTripData({ ...tripData, interests: newInterests });
              }
            )}
          </View>

          <View style={styles.section}>
            {renderSectionTitle('Budget', 'wallet-outline')}
            <View style={styles.budgetContainer}>
              <Text style={styles.budgetValue}>${tripData.budget}</Text>
              <Slider
                style={styles.slider}
                minimumValue={100}
                maximumValue={10000}
                step={100}
                value={tripData.budget}
                onValueChange={(value) => setTripData({ ...tripData, budget: value })}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
              />
              <View style={styles.budgetLabels}>
                <Text style={styles.budgetLabel}>$100</Text>
                <Text style={styles.budgetLabel}>$10,000</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            {renderSectionTitle('Trip Photos', 'images-outline')}
            <ImagePickerComponent
              images={tripData.images}
              onImagesSelected={(images) => setTripData({ ...tripData, images })}
            />
          </View>

          <View style={styles.section}>
            {renderSectionTitle('Additional Options', 'options-outline')}
            <View style={styles.switchContainer}>
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>Insurance Required</Text>
                <Switch
                  value={tripData.insuranceRequired}
                  onValueChange={(value) =>
                    setTripData({ ...tripData, insuranceRequired: value })
                  }
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
              <View style={styles.switchItem}>
                <Text style={styles.switchLabel}>Visa Required</Text>
                <Switch
                  value={tripData.visaRequired}
                  onValueChange={(value) =>
                    setTripData({ ...tripData, visaRequired: value })
                  }
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {showStartDate && (
        <DateTimePicker
          value={tripData.startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDate(false);
            if (selectedDate) {
              setTripData({ ...tripData, startDate: selectedDate });
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {showEndDate && (
        <DateTimePicker
          value={tripData.endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDate(false);
            if (selectedDate) {
              setTripData({ ...tripData, endDate: selectedDate });
            }
          }}
          minimumDate={tripData.startDate}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: spacing.s,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.m,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  inputContainer: {
    marginBottom: spacing.m,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    padding: spacing.m,
    borderRadius: borderRadius.m,
    fontSize: 16,
    color: colors.text,
  },
  suggestionsList: {
    maxHeight: 200,
    marginTop: spacing.xs,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  suggestionText: {
    marginLeft: spacing.s,
    color: colors.text,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.m,
  },
  dateInput: {
    flex: 1,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: spacing.m,
    borderRadius: borderRadius.m,
  },
  dateText: {
    marginLeft: spacing.s,
    color: colors.text,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.s,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    marginLeft: spacing.xs,
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.white,
  },
  budgetContainer: {
    alignItems: 'center',
    paddingVertical: spacing.m,
  },
  budgetValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.m,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  budgetLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: spacing.xs,
  },
  budgetLabel: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  switchContainer: {
    gap: spacing.m,
  },
  switchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: spacing.m,
    borderRadius: borderRadius.m,
  },
  switchLabel: {
    color: colors.text,
    fontSize: 16,
  },
});

export default CreateTripScreen;
