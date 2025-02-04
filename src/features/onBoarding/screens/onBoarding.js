import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import image1 from '../../../assets/image.png';
import image2 from '../../../assets/image2.png';
import image3 from '../../../assets/image3.png';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Recherchez vos',
    titleHighlight: 'Destinations',
    subtitle:
      'Explorez et trouvez facilement des hébergements, activités et moyens de transport adaptés à vos besoins.',
    image: image1,
  },
  {
    id: '2',
    title: 'Personnalisez votre',
    titleHighlight: 'Itinéraire',
    subtitle:
      'Regroupez automatiquement les services sélectionnés pour créer un itinéraire de voyage organisé.',
    image: image2,
  },
  {
    id: '3',
    title: 'Réservez en toute',
    titleHighlight: 'Confiance',
    subtitle:
      'Connectez-vous aux prestataires de services et réservez facilement depuis l’application.',
    image: image3,
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0]?.index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Redirection vers l'écran Login lorsque l'utilisateur clique sur "Get Started"
      navigation.navigate('Login');
    }
  };

  const Slide = ({ item, index }) => {
    const scale = scrollX.interpolate({
      inputRange: [(index - 1) * width, index * width, (index + 1) * width],
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.slide}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {item.title}{' '}
            <Text style={styles.titleHighlight}>{item.titleHighlight}</Text>
          </Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>

        <Animated.View
          style={[
            styles.imageContainer,
            { transform: [{ scale }] }, // Applique l'animation de zoom
          ]}
        >
          <Animated.Image
            source={item.image}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>
      </View>
    );
  };

  const Pagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {slides.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              style={[
                styles.dot,
                { width: dotWidth, opacity, transform: [{ scale }] },
              ]}
              key={index.toString()}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={slides}
        renderItem={({ item, index }) => <Slide item={item} index={index} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      <Pagination />
      <TouchableOpacity style={styles.button} onPress={scrollTo}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    height,
    alignItems: 'center',
    padding: 20,
  },
  titleContainer: {
    marginTop: height * 0.1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  titleHighlight: {
    color: '#fea347',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  imageContainer: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    marginTop: height * 0.15,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: (width * 0.7) / 2,
  },
  paginationContainer: {
    flexDirection: 'row',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5831f',
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#fea347',
    padding: 15,
    borderRadius: 30,
    width: width * 0.8,
    marginBottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
