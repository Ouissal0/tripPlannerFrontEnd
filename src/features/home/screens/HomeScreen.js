import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  Image,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, borderRadius } from '../../../styles/commonStyles';
import { tripService } from '../services/tripService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All', icon: 'globe-outline' },
    { id: 'beach', name: 'Beach', icon: 'sunny-outline' },
    { id: 'mountain', name: 'Mountain', icon: 'triangle-outline' },
    { id: 'city', name: 'City', icon: 'business-outline' },
    { id: 'cultural', name: 'Cultural', icon: 'museum-outline' },
  ];

  const quickActions = [
    {
      id: 'create',
      name: 'Create Trip',
      icon: 'add-circle-outline',
      color: colors.primary,
      onPress: () => navigation.navigate('CreateTrip'),
    },
    {
      id: 'explore',
      name: 'Explore',
      icon: 'compass-outline',
      color: '#FF6B6B',
      onPress: () => navigation.navigate('Explore'),
    },
    {
      id: 'favorites',
      name: 'Favorites',
      icon: 'heart-outline',
      color: '#4ECDC4',
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      id: 'nearby',
      name: 'Nearby',
      icon: 'location-outline',
      color: '#FFD93D',
      onPress: () => navigation.navigate('Nearby'),
    },
  ];

  useEffect(() => {
    fetchTrips();
  }, [route]);

  const fetchTrips = async () => {
    try {
      const fetchedTrips = await tripService.getTrips();
      setTrips(fetchedTrips);
    } catch (error) {
      console.error('Erreur:', error);
      Alert.alert('Erreur', 'Impossible de charger les voyages');
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.greeting}>Hello!</Text>
          <Text style={styles.subtitle}>Where do you want to go?</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="person-circle-outline" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

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
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.quickActionItem}
            onPress={action.onPress}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
              <Icon name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={styles.quickActionText}>{action.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={styles.sectionTitle}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.name && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.name)}
          >
            <Icon
              name={category.icon}
              size={20}
              color={selectedCategory === category.name ? colors.white : colors.primary}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.name && styles.selectedCategoryText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTripCard = ({ item }) => {
    const defaultImage = require('../../../assets/image.png');
    let imageSource = defaultImage;

    if (item.images && item.images.length > 0 && item.images[0]) {
      const firstImage = item.images[0];
      if (firstImage.startsWith('data:image')) {
        imageSource = { uri: firstImage };
      } else if (firstImage.startsWith('http')) {
        imageSource = { 
          uri: firstImage,
          cache: 'reload',
        };
      } else {
        try {
          imageSource = { 
            uri: `data:image/jpeg;base64,${firstImage}`,
          };
        } catch (error) {
          imageSource = defaultImage;
        }
      }
    }

    return (
      <TouchableOpacity
        style={styles.tripCard}
        onPress={() => navigation.navigate('TripDetails', { tripData: item })}
        activeOpacity={0.8}
      >
        <ImageBackground
          source={imageSource}
          style={styles.tripImage}
          imageStyle={styles.tripImageStyle}
          resizeMode="cover"
        >
          <View style={styles.tripOverlay}>
            <View style={styles.tripInfo}>
              <Text style={styles.tripTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={styles.tripDetails}>
                <View style={styles.tripDetailItem}>
                  <Icon name="location-outline" size={16} color={colors.white} />
                  <Text style={styles.tripDetailText} numberOfLines={1}>
                    {item.mainDestination}
                  </Text>
                </View>
                <View style={styles.tripDetailItem}>
                  <Icon name="calendar-outline" size={16} color={colors.white} />
                  <Text style={styles.tripDetailText}>
                    {new Date(item.startDate).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const renderPopularTrips = () => (
    <View style={styles.popularTripsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Trips</Text>
        <TouchableOpacity onPress={() => navigation.navigate('AllTrips')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={trips}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tripsListContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="airplane-outline" size={48} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No trips available</Text>
          </View>
        }
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderHeader()}
        {renderQuickActions()}
        {renderCategories()}
        {renderPopularTrips()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: spacing.l,
    backgroundColor: colors.white,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  profileButton: {
    padding: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: spacing.m,
    borderRadius: borderRadius.l,
    marginTop: spacing.s,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.s,
    fontSize: 16,
    color: colors.text,
  },
  quickActionsContainer: {
    padding: spacing.l,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.m,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  quickActionText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  categoriesContainer: {
    padding: spacing.l,
    backgroundColor: colors.white,
    marginTop: spacing.m,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: borderRadius.l,
    marginRight: spacing.s,
    backgroundColor: colors.backgroundLight,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    marginLeft: spacing.xs,
    color: colors.primary,
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: colors.white,
  },
  popularTripsContainer: {
    padding: spacing.l,
    backgroundColor: colors.white,
    marginTop: spacing.m,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  tripsListContainer: {
    paddingRight: spacing.m,
  },
  tripCard: {
    width: width * 0.7,
    marginRight: spacing.m,
    borderRadius: borderRadius.l,
    elevation: 3,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tripImage: {
    height: 200,
    justifyContent: 'flex-end',
  },
  tripImageStyle: {
    borderRadius: borderRadius.l,
  },
  tripOverlay: {
    padding: spacing.m,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: borderRadius.l,
  },
  tripInfo: {
    justifyContent: 'flex-end',
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.s,
  },
  tripDetails: {
    gap: spacing.xs,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDetailText: {
    marginLeft: spacing.xs,
    fontSize: 14,
    color: colors.white,
  },
  emptyContainer: {
    width: width * 0.7,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.l,
  },
  emptyText: {
    marginTop: spacing.s,
    color: colors.textSecondary,
    fontSize: 16,
  },
});

export default HomeScreen;