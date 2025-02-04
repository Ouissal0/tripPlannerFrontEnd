import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const PlaceDetailsScreen = ({ route, navigation }) => {
  const { place } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={place.image} style={styles.image} />
        
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{place.name}</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>{place.rating}</Text>
            </View>
          </View>

          <Text style={styles.description}>{place.description}</Text>

          {/* Additional Details */}
          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            <View style={styles.highlightsList}>
              <View style={styles.highlightItem}>
                <Icon name="sunny" size={24} color="#2196F3" />
                <Text style={styles.highlightText}>Perfect Weather</Text>
              </View>
              <View style={styles.highlightItem}>
                <Icon name="restaurant" size={24} color="#2196F3" />
                <Text style={styles.highlightText}>Local Cuisine</Text>
              </View>
              <View style={styles.highlightItem}>
                <Icon name="camera" size={24} color="#2196F3" />
                <Text style={styles.highlightText}>Scenic Views</Text>
              </View>
            </View>
          </View>

          {/* Book Now Button */}
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
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
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  highlightsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  highlightItem: {
    alignItems: 'center',
  },
  highlightText: {
    marginTop: 8,
    fontSize: 14,
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
});

export default PlaceDetailsScreen;
