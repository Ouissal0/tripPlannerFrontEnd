import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const TripSummaryScreen = ({ route, navigation }) => {
  const { tripData } = route.params;

  const handleSaveTrip = () => {
    // TODO: Implement trip saving logic
    Alert.alert(
      'Success',
      'Your trip has been saved successfully!',
      [
        {
          text: 'View My Trips',
          onPress: () => navigation.navigate('Trips'),
        },
        {
          text: 'Back to Home',
          onPress: () => navigation.navigate('Home'),
        },
      ]
    );
  };

  const renderSection = (title, content) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{content}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Trip Summary</Text>
        </View>

        {/* Trip Title */}
        {renderSection('Trip Title', (
          <Text style={styles.text}>{tripData.title}</Text>
        ))}

        {/* Destination */}
        {renderSection('Destination', (
          <Text style={styles.text}>{tripData.mainDestination?.description}</Text>
        ))}

        {/* Dates */}
        {renderSection('Travel Dates', (
          <View>
            <Text style={styles.text}>
              From: {tripData.startDate.toLocaleDateString()}
            </Text>
            <Text style={styles.text}>
              To: {tripData.endDate.toLocaleDateString()}
            </Text>
          </View>
        ))}

        {/* Transport */}
        {renderSection('Transport Mode', (
          <View style={styles.transportContainer}>
            <Icon
              name={
                tripData.transportMode === 'car'
                  ? 'car'
                  : tripData.transportMode === 'plane'
                  ? 'airplane'
                  : tripData.transportMode === 'train'
                  ? 'train'
                  : 'bus'
              }
              size={24}
              color="#2196F3"
            />
            <Text style={[styles.text, styles.transportText]}>
              {tripData.transportMode.charAt(0).toUpperCase() +
                tripData.transportMode.slice(1)}
            </Text>
          </View>
        ))}

        {/* Interests */}
        {tripData.interests.length > 0 &&
          renderSection('Interests', (
            <View style={styles.interestsContainer}>
              {tripData.interests.map((interest) => (
                <View key={interest} style={styles.interestTag}>
                  <Text style={styles.interestText}>
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          ))}

        {/* Budget */}
        {renderSection('Budget', (
          <Text style={styles.text}>
            ${Math.round(tripData.budget).toLocaleString()}
          </Text>
        ))}

        {/* Activities */}
        {tripData.activities.length > 0 &&
          renderSection('Planned Activities', (
            <View>
              {tripData.activities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>{activity.name}</Text>
                    <Text style={styles.activityTime}>
                      {activity.time.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <Text style={styles.activityDescription}>
                    {activity.description}
                  </Text>
                </View>
              ))}
            </View>
          ))}

        {/* Companions */}
        {tripData.companions.length > 0 &&
          renderSection('Travel Companions', (
            <View>
              {tripData.companions.map((email) => (
                <View key={email} style={styles.companionItem}>
                  <Icon name="person" size={20} color="#2196F3" />
                  <Text style={[styles.text, styles.companionEmail]}>{email}</Text>
                </View>
              ))}
            </View>
          ))}

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveTrip}>
          <Text style={styles.saveButtonText}>Save Trip</Text>
        </TouchableOpacity>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.editButtonText}>Edit Trip</Text>
        </TouchableOpacity>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2196F3',
  },
  sectionContent: {
    marginLeft: 8,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  transportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transportText: {
    marginLeft: 8,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  activityItem: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  activityTime: {
    color: '#666',
  },
  activityDescription: {
    color: '#666',
  },
  companionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  companionEmail: {
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  editButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  editButtonText: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TripSummaryScreen;
