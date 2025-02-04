import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const TripDetailsScreen = ({ route, navigation }) => {
  const { trip } = route.params || {};

  // Default itinerary if none is provided
  const defaultItinerary = [
    {
      id: '1',
      day: 'Day 1',
      title: 'Arrival & Welcome',
      activities: [
        'Airport pickup',
        'Hotel check-in',
        'Welcome dinner',
      ],
    },
    {
      id: '2',
      day: 'Day 2',
      title: 'City Exploration',
      activities: [
        'Guided city tour',
        'Visit to historical sites',
        'Local market visit',
      ],
    },
  ];

  // Use trip's itinerary if available, otherwise use default
  const itinerary = trip?.itinerary || defaultItinerary;

  const renderItineraryDay = ({ item }) => (
    <View style={styles.dayContainer}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{item.day}</Text>
        <Text style={styles.dayTitle}>{item.title}</Text>
      </View>
      {item.activities?.map((activity, index) => (
        <View key={index} style={styles.activityItem}>
          <Icon name="checkmark-circle" size={20} color="#2196F3" />
          <Text style={styles.activityText}>{activity}</Text>
        </View>
      ))}
    </View>
  );

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>Trip details not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {trip.image && (
          <Image 
            source={trip.image} 
            style={styles.image}
            defaultSource={require('../../../assets/image.png')}
          />
        )}
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{trip.name || 'Trip Details'}</Text>
            {trip.rating && (
              <View style={styles.ratingContainer}>
                <Icon name="star" size={20} color="#FFD700" />
                <Text style={styles.rating}>{trip.rating}</Text>
              </View>
            )}
          </View>

          {/* Trip Overview */}
          <View style={styles.overviewContainer}>
            {trip.duration && (
              <View style={styles.overviewItem}>
                <Icon name="time" size={24} color="#2196F3" />
                <Text style={styles.overviewText}>{trip.duration}</Text>
              </View>
            )}
            {trip.price && (
              <View style={styles.overviewItem}>
                <Icon name="pricetag" size={24} color="#2196F3" />
                <Text style={styles.overviewText}>{trip.price}</Text>
              </View>
            )}
            {trip.groupSize && (
              <View style={styles.overviewItem}>
                <Icon name="people" size={24} color="#2196F3" />
                <Text style={styles.overviewText}>{trip.groupSize}</Text>
              </View>
            )}
          </View>

          {/* Interests Tags */}
          {trip.interests && trip.interests.length > 0 && (
            <View style={styles.interestsContainer}>
              {trip.interests.map((interest, index) => (
                <View key={index} style={styles.interestTag}>
                  <Text style={styles.interestText}>{interest}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Itinerary Section */}
          <View style={styles.itinerarySection}>
            <Text style={styles.sectionTitle}>Trip Itinerary</Text>
            <FlatList
              data={itinerary}
              renderItem={renderItineraryDay}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>

          {/* Book Now Button */}
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => navigation.navigate('BookTrip', { tripId: trip.id })}
          >
            <Text style={styles.bookButtonText}>Book This Trip</Text>
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 18,
    fontWeight: '600',
  },
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  interestTag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    color: '#2196F3',
    fontSize: 14,
  },
  itinerarySection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  dayContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dayHeader: {
    marginBottom: 12,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 4,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  activityText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  bookButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TripDetailsScreen;
