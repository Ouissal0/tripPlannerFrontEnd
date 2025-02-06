import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Dimensions,
  RefreshControl,
  ImageBackground,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing } from '../../../styles/commonStyles';
import AuthService from '../../auth/services/AuthService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await AuthService.getUserData();
      setUserData(user);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Add your refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const interests = [
    'Adventure', 'Culture', 'Nature', 'Food', 'Beach',
    'Mountains', 'Cities', 'History', 'Art', 'Shopping'
  ];

  const quickActions = [
    {
      icon: 'map-outline',
      title: 'Explore',
      onPress: () => navigation.navigate('Map'),
    },
    {
      icon: 'calendar-outline',
      title: 'Plan Trip',
      onPress: () => navigation.navigate('CreateTrip'),
    },
    {
      icon: 'heart-outline',
      title: 'Favorites',
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      icon: 'people-outline',
      title: 'Groups',
      onPress: () => navigation.navigate('Groups'),
    },
  ];

  const popularDestinations = [
    {
      id: '1',
      name: 'Paris',
      country: 'France',
      image: require('../../../assets/image.png'),
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Tokyo',
      country: 'Japan',
      image: require('../../../assets/image.png'),
      rating: 4.9,
    },
    {
      id: '3',
      name: 'New York',
      country: 'USA',
      image: require('../../../assets/image.png'),
      rating: 4.7,
    },
  ];

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <Icon name="search-outline" size={20} color={colors.textSecondary} />
      <TextInput
        style={styles.searchInput}
        placeholder="Search destinations..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={colors.textSecondary}
      />
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickActionItem}
            onPress={action.onPress}
          >
            <View style={styles.quickActionIcon}>
              <Icon name={action.icon} size={24} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderInterests = () => (
    <View style={styles.interestsContainer}>
      <Text style={styles.sectionTitle}>Explore Interests</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {interests.map((interest, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.interestChip,
              selectedInterests.includes(interest) && styles.selectedInterestChip,
            ]}
            onPress={() => {
              if (selectedInterests.includes(interest)) {
                setSelectedInterests(selectedInterests.filter(item => item !== interest));
              } else {
                setSelectedInterests([...selectedInterests, interest]);
              }
            }}
          >
            <Text
              style={[
                styles.interestText,
                selectedInterests.includes(interest) && styles.selectedInterestText,
              ]}
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDestinationCard = ({ item }) => (
    <TouchableOpacity
      style={styles.destinationCard}
      onPress={() => navigation.navigate('PlaceDetails', { place: item })}
    >
      <ImageBackground
        source={item.image}
        style={styles.destinationImage}
        imageStyle={{ borderRadius: 15 }}
      >
        <View style={styles.destinationOverlay}>
          <View style={styles.destinationInfo}>
            <Text style={styles.destinationName}>{item.name}</Text>
            <Text style={styles.destinationCountry}>{item.country}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImageBackground
          source={require('../../../assets/imageSignup.png')}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>
              Welcome back{userData ? `, ${userData.firstName}!` : '!'}
            </Text>
            <Text style={styles.headerSubtitle}>
              Where would you like to explore today?
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.content}>
          {renderSearchBar()}
          
          {renderInterests()}

          <View style={styles.popularContainer}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <FlatList
              data={popularDestinations}
              renderItem={renderDestinationCard}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.destinationsList}
            />
            {renderQuickActions()}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    height: 200,
    justifyContent: 'flex-end',
  },
  headerContent: {
    padding: spacing.xl,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  content: {
    marginTop: -20,
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.l,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.m,
    borderRadius: 15,
    marginBottom: spacing.l,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.s,
    fontSize: 16,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.m,
  },
  quickActionsContainer: {
    marginBottom: spacing.xl,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: (width - spacing.l * 3) / 2,
    backgroundColor: colors.white,
    padding: spacing.m,
    borderRadius: 15,
    marginBottom: spacing.m,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.s,
  },
  quickActionText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  interestsContainer: {
    marginBottom: spacing.xl,
  },
  interestChip: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    backgroundColor: colors.background,
    borderRadius: 20,
    marginRight: spacing.s,
  },
  selectedInterestChip: {
    backgroundColor: colors.primary,
  },
  interestText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedInterestText: {
    color: colors.white,
  },
  popularContainer: {
    marginBottom: spacing.xl,
  },
  destinationsList: {
    paddingRight: spacing.l,
  },
  destinationCard: {
    width: width * 0.8,
    height: 200,
    marginRight: spacing.m,
  },
  destinationImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  destinationOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  destinationCountry: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
});

export default HomeScreen;
