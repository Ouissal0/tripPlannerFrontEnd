import axios from 'axios';
import { API_URL } from '../../../config/api.config';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const cleanBase64Image = (base64String) => {
  if (!base64String) return null;

  // Si c'est une URL, la retourner telle quelle
  if (base64String.startsWith('http://') || base64String.startsWith('https://')) {
    return base64String;
  }

  try {
    // Si l'image est déjà au format data:image, la retourner
    if (base64String.startsWith('data:image')) {
      return base64String;
    }

    // Nettoyer le base64 de tout préfixe
    let cleanBase64 = base64String;
    if (base64String.includes('base64,')) {
      cleanBase64 = base64String.split('base64,')[1];
    }

    // Vérifier que c'est un base64 valide
    Buffer.from(cleanBase64, 'base64');

    // Retourner le format complet
    return `data:image/jpeg;base64,${cleanBase64}`;
  } catch (e) {
    console.error('Invalid base64:', e);
    return null;
  }
};

const processImage = (img) => {
  if (!img) return null;

  // Si c'est un objet avec une propriété base64 (venant de react-native-image-picker)
  if (typeof img === 'object') {
    if (img.base64) {
      return cleanBase64Image(img.base64);
    }
    if (img.uri) {
      return img.uri;
    }
  }

  // Si c'est une chaîne de caractères
  if (typeof img === 'string') {
    return cleanBase64Image(img);
  }

  return null;
};

export const tripService = {
  createTrip: async (tripData) => {
    try {
      // Traiter les images
      const images = tripData.images 
        ? tripData.images.map(processImage).filter(Boolean)
        : [];
      
      // Créer un nouvel objet avec les images traitées
      const tripDataWithImages = {
        ...tripData,
        images: images,
        startDate: new Date(tripData.startDate).toISOString(),
        endDate: new Date(tripData.endDate).toISOString(),
      };

      console.log('Sending trip data:', {
        title: tripDataWithImages.title,
        mainDestination: tripDataWithImages.mainDestination,
        imageCount: images.length
      });

      const response = await axiosInstance.post('/trips', tripDataWithImages);
      
      // Traiter les images dans la réponse
      const processedTrip = {
        ...response.data,
        images: response.data.images?.map(processImage).filter(Boolean) || []
      };

      console.log('Trip created successfully:', {
        title: processedTrip.title,
        imageCount: processedTrip.images.length
      });

      return processedTrip;
    } catch (error) {
      console.error('API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      throw { 
        message: error.response?.data?.message || error.message || 'Failed to create trip',
        details: error.response?.data
      };
    }
  },

  getTrips: async () => {
    try {
      console.log('Fetching trips from API...');
      const response = await axiosInstance.get('/trips');
      
      console.log('Raw API response:', {
        status: response.status,
        tripCount: response.data?.length || 0,
        data: response.data?.map(trip => ({
          id: trip.id,
          title: trip.title,
          imageCount: trip.images?.length || 0,
          firstImage: trip.images?.[0]?.substring(0, 50) + '...' || 'no image'
        }))
      });
      
      // Traiter les images pour chaque voyage
      const trips = response.data.map(trip => {
        const processedImages = trip.images?.map(processImage).filter(Boolean) || [];
        console.log(`Processing trip "${trip.title}":`, {
          originalImages: trip.images?.length || 0,
          processedImages: processedImages.length,
          sampleImage: processedImages[0]?.substring(0, 50) + '...' || 'none'
        });

        return {
          ...trip,
          images: processedImages
        };
      });

      console.log('Final processed trips:', {
        totalTrips: trips.length,
        tripsWithImages: trips.filter(t => t.images?.length > 0).length,
        tripDetails: trips.map(t => ({
          id: t.id,
          title: t.title,
          imageCount: t.images?.length || 0
        }))
      });

      return trips;
    } catch (error) {
      console.error('API Error in getTrips:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: error.config?.url
      });
      throw error.response?.data || { message: 'Failed to fetch trips' };
    }
  }
};
