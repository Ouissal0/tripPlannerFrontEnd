import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons';
import commonStyles, { colors } from '../../../styles/commonStyles';

const { width, height } = Dimensions.get('window');
const MarkerView = ({ price }) => (
  <View style={styles.markerWrapper}>
    <View style={styles.markerContainer}>
      <Text style={styles.markerPrice}>{price}</Text>
    </View>
    <View style={styles.markerArrow} />
  </View>
);
const CARD_HEIGHT = 280;
const CARD_WIDTH = width * 0.7;

const trips = [
  {
    id: '1',
    coordinate: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
    title: 'Studio Gare de Paris',
    description: 'Modern studio near Paris train station',
    price: '$1,200.00',
    image: require('../../../assets/image1.png'),
    rating: 4.7,
    reviews: 785,
    interests: ['culture', 'city'],
  },
  {
    id: '2',
    coordinate: {
      latitude: 49.4431,
      longitude: 1.0993,
    },
    title: 'Studio Gare de Rouen',
    description: 'Cozy apartment in the heart of Rouen',
    price: '$950.50',
    image: require('../../../assets/image.png'),
    rating: 4.5,
    reviews: 456,
    interests: ['culture', 'history'],
  },
  // Add more trips here
];

const interests = [
  { id: 'villa', label: 'Villa', icon: 'home' },
  { id: 'hotel', label: 'Hotel', icon: 'bed' },
  { id: 'mansion', label: 'Mansion', icon: 'business' },
];

const TripsScreen = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [region, setRegion] = useState({
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 3,
    longitudeDelta: 3,
  });
  
  const mapRef = useRef(null);
  const scrollView = useRef(null);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const onMarkerPress = (mapEventData) => {
    const markerID = mapEventData._targetInst.return.key;
    let x = (markerID * CARD_WIDTH) + (markerID * 20);
    
    scrollView.current?.scrollTo({x: x, y: 0, animated: true});
  };

  return (
    <View style={commonStyles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={colors.textSecondary} />
          <TextInput
            placeholder="Search name, city, or everything..."
            style={styles.searchInput}
            placeholderTextColor={colors.textSecondary}
          />
        </View>
      </View>

      {/* Interest Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.interestsContainer}
        contentContainerStyle={styles.interestsContent}
      >
        {interests.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestButton,
              selectedInterests.includes(interest.id) && styles.interestButtonActive
            ]}
            onPress={() => toggleInterest(interest.id)}
          >
            <Icon 
              name={interest.icon} 
              size={16} 
              color={selectedInterests.includes(interest.id) ? colors.white : colors.primary}
            />
            <Text style={[
              styles.interestText,
              selectedInterests.includes(interest.id) && styles.interestTextActive
            ]}>
              {interest.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Map View */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
      >
        {trips.map((trip) => (
          <Marker
  key={trip.id}
  coordinate={trip.coordinate}
  onPress={(e) => onMarkerPress(e)}
>
  <MarkerView price={trip.price} />
</Marker>
        ))}
      </MapView>

      {/* Bottom Cards */}
      <Animated.ScrollView
        ref={scrollView}
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        pagingEnabled
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center"
        contentContainerStyle={styles.endPadding}
      >
        {trips.map((trip) => (
          <View style={styles.card} key={trip.id}>
            <Image
              source={trip.image}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.textContent}>
              <Text style={styles.cardTitle}>{trip.title}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {trip.rating} • {trip.reviews} Reviews
                </Text>
              </View>
              <Text style={styles.cardDescription}>{trip.description}</Text>
              <Text style={styles.cardPrice}>{trip.price}<Text style={styles.perNight}>/night</Text></Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    height:50,
    zIndex: 3,
    paddingHorizontal: 10,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.30,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: colors.text,
  },
  interestsContainer: {
    position: 'absolute',
    top: 70,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  interestsContent: {
    paddingHorizontal: 10,
  },
  interestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  interestButtonActive: {
    backgroundColor: colors.primary,
  },
  interestText: {
    marginLeft: 5,
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  interestTextActive: {
    color: colors.white,
  },
  map: {
    flex: 1,
  },
  markerWrapper: {
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.white,
    overflow: 'visible',
    zIndex: 1,
  },
  markerPrice: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    marginTop: -1,
  },
  scrollView: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingHorizontal: 20,
  },
  card: {
    elevation: 2,
    backgroundColor: colors.white,
    borderRadius: 15,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 12,
    color: colors.textSecondary,
  },
  cardDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 5,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  perNight: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: 'normal',
  },
});

export default TripsScreen;
