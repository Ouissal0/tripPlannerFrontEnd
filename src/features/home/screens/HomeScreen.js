import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Simulated user preferences
  const userPreferences = {
    interests: ['Beach', 'Culture'],
    favoriteDestinations: ['Greece', 'Japan'],
    budget: 'medium',
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const popularPlaces = [
    {
      id: '1',
      name: 'Santorini, Greece',
      image: require('../../../assets/image.png'),
      rating: 4.8,
      description: 'Beautiful island with white-washed buildings',
      priceRange: '€€€',
      activities: ['Beach', 'Sightseeing', 'Dining'],
    },
    {
      id: '2',
      name: 'Kyoto, Japan',
      image: require('../../../assets/image.png'),
      rating: 4.7,
      description: 'Traditional Japanese culture and temples',
      priceRange: '€€',
      activities: ['Culture', 'Temples', 'Gardens'],
    },
  ];

  const interests = [
    { id: '1', name: 'Beach', icon: 'umbrella' },
    { id: '2', name: 'Mountains', icon: 'mountain' },
    { id: '3', name: 'Culture', icon: 'museum' },
    { id: '4', name: 'Adventure', icon: 'compass' },
    { id: '5', name: 'Food', icon: 'restaurant' },
    { id: '6', name: 'Nature', icon: 'leaf' },
  ];

  const organizedTrips = [
    {
      id: '1',
      name: 'Greek Islands Explorer',
      image: require('../../../assets/image.png'),
      duration: '7 days',
      price: '$1,999',
      rating: 4.9,
      interests: ['Beach', 'Culture'],
      startDate: '2025-06-15',
      groupSize: '8-12 people',
    },
    {
      id: '2',
      name: 'Japanese Culture Tour',
      image: require('../../../assets/image.png'),
      duration: '10 days',
      price: '$2,499',
      rating: 4.8,
      interests: ['Culture', 'Food'],
      startDate: '2025-07-01',
      groupSize: '6-10 people',
    },
  ];

  const upcomingTrips = [
    {
      id: '1',
      name: 'Paris Weekend',
      image: require('../../../assets/image.png'),
      startDate: '2025-03-15',
      endDate: '2025-03-17',
      status: 'confirmed',
    },
    {
      id: '2',
      name: 'Barcelona Adventure',
      image: require('../../../assets/image.png'),
      startDate: '2025-05-01',
      endDate: '2025-05-07',
      status: 'planning',
    },
  ];

  const personalizedSuggestions = [
    {
      id: '1',
      name: 'Bali Retreat',
      image: require('../../../assets/image.png'),
      reason: 'Based on your interest in beaches',
      price: '$1,799',
      duration: '6 days',
    },
    {
      id: '2',
      name: 'Rome Cultural Tour',
      image: require('../../../assets/image.png'),
      reason: 'Matches your cultural preferences',
      price: '$1,599',
      duration: '5 days',
    },
  ];

  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const filteredTrips = selectedInterests.length > 0
    ? organizedTrips.filter(trip =>
        trip.interests.some(interest => selectedInterests.includes(interest))
      )
    : organizedTrips;

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search destinations, activities, or trips..."
        placeholderTextColor="#666"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearButton}>
        {searchQuery ? <Icon name="close-circle" size={20} color="#666" /> : null}
      </TouchableOpacity>
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={styles.quickActionButton}
        onPress={() => navigation.navigate('CreateTrip')}
      >
        <Icon name="add-circle" size={24} color="#fff" />
        <Text style={styles.quickActionButtonText}>Create New Trip</Text>
      </TouchableOpacity>
    </View>
  );

  const renderUpcomingTrips = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Upcoming Trips</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Trips')}>
          <Text style={styles.seeAllButton}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {upcomingTrips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.upcomingTripCard}
            onPress={() => navigation.navigate('TripDetails', { trip })}
          >
            <Image source={trip.image} style={styles.upcomingTripImage} />
            <View style={styles.upcomingTripInfo}>
              <Text style={styles.upcomingTripName}>{trip.name}</Text>
              <Text style={styles.upcomingTripDate}>{trip.startDate} - {trip.endDate}</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: trip.status === 'confirmed' ? '#4CAF50' : '#FFA000' }
              ]}>
                <Text style={styles.statusText}>
                  {trip.status === 'confirmed' ? 'Confirmed' : 'Planning'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPopularPlace = ({ item }) => (
    <TouchableOpacity
      style={styles.popularPlaceCard}
      onPress={() => navigation.navigate('PlaceDetails', { place: item })}
    >
      <Image source={item.image} style={styles.placeImage} />
      <View style={styles.placeInfo}>
        <View style={styles.placeHeader}>
          <Text style={styles.placeName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.priceRange}>{item.priceRange}</Text>
        <View style={styles.activitiesContainer}>
          {item.activities.map((activity, index) => (
            <View key={index} style={styles.activityTag}>
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPersonalizedSuggestion = ({ item }) => (
    <TouchableOpacity
      style={styles.suggestionCard}
      onPress={() => navigation.navigate('TripDetails', { trip: item })}
    >
      <Image source={item.image} style={styles.suggestionImage} />
      <View style={styles.suggestionInfo}>
        <Text style={styles.suggestionName}>{item.name}</Text>
        <Text style={styles.suggestionReason}>{item.reason}</Text>
        <View style={styles.suggestionDetails}>
          <Text style={styles.suggestionPrice}>{item.price}</Text>
          <Text style={styles.suggestionDuration}>{item.duration}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderSearchBar()}
        {renderQuickActions()}
        
        {/* Upcoming Trips Section */}
        {upcomingTrips.length > 0 && renderUpcomingTrips()}

        {/* Popular Places Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Places</Text>
          <FlatList
            data={popularPlaces}
            renderItem={renderPopularPlace}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.popularPlacesList}
          />
        </View>

        {/* Organized Trips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Organized Trips</Text>
          
          {/* Interests Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.interestsScroll}>
            {interests.map(interest => (
              <TouchableOpacity
                key={interest.id}
                style={[
                  styles.interestChip,
                  selectedInterests.includes(interest.name) && styles.interestChipSelected
                ]}
                onPress={() => toggleInterest(interest.name)}
              >
                <Icon name={interest.icon} size={16} color={selectedInterests.includes(interest.name) ? '#fff' : '#666'} />
                <Text style={[
                  styles.interestChipText,
                  selectedInterests.includes(interest.name) && styles.interestChipTextSelected
                ]}>
                  {interest.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <FlatList
            data={filteredTrips}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.tripCard}
                onPress={() => navigation.navigate('TripDetails', { trip: item })}
              >
                <Image source={item.image} style={styles.tripImage} />
                <View style={styles.tripInfo}>
                  <Text style={styles.tripName}>{item.name}</Text>
                  <View style={styles.tripDetails}>
                    <Text style={styles.tripDuration}>{item.duration}</Text>
                    <Text style={styles.tripPrice}>{item.price}</Text>
                  </View>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tripsList}
          />
        </View>

        {/* Personalized Suggestions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested for You</Text>
          <Text style={styles.sectionSubtitle}>Based on your preferences</Text>
          <FlatList
            data={personalizedSuggestions}
            renderItem={renderPersonalizedSuggestion}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestionsList}
          />
        </View>
      </ScrollView>
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 25,
    fontSize: 16,
    paddingLeft: 40,
  },
  searchClearButton: {
    position: 'absolute',
    right: 24,
    top: 20,
  },
  quickActionsContainer: {
    padding: 10,
    paddingTop: 0,

  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  quickActionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom:2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  seeAllButton: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '600',
  },
  popularPlacesList: {
    marginTop: 16,
  },
  popularPlaceCard: {
    width: width * 0.7,
    marginRight: 16,
    marginLeft:5,
    marginBottom:5,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  placeImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  placeInfo: {
    padding: 12,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  priceRange: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 8,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  activityText: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  interestsScroll: {
    marginVertical: 16,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 8,
  },
  interestChipSelected: {
    backgroundColor: '#2196F3',
  },
  interestChipText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  interestChipTextSelected: {
    color: '#fff',
  },
  upcomingTripCard: {
    width: width * 0.7,
    marginRight: 16,
    marginLeft:4,
    marginBottom: 4,
    marginTop:1, 
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  upcomingTripImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  upcomingTripInfo: {
    padding: 12,
  },
  upcomingTripName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  upcomingTripDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  suggestionCard: {
    width: width * 0.7,
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom:5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  suggestionImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  suggestionInfo: {
    padding: 12,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestionReason: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  suggestionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestionPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
  suggestionDuration: {
    fontSize: 14,
    color: '#666',
  },
  tripCard: {
    width: 300,
    marginRight: 16,
    marginBottom: 4,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tripInfo: {
    padding: 12,
  },
  tripName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tripDuration: {
    fontSize: 14,
    color: '#666',
  },
  tripPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2196F3',
  },
});

export default HomeScreen;
