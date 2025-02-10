import io from 'socket.io-client';
import { SOCKET_URL } from '../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SocketService {
  constructor() {
    this.socket = null;
    this.token = null;
  }

  async init() {
    try {
      this.token = await AsyncStorage.getItem('userToken');
      this.socket = io(SOCKET_URL, {
        auth: {
          token: this.token
        },
        transports: ['websocket']
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });

      this.socket.on('error', (error) => {
        console.error('WebSocket error:', error);
      });
    } catch (error) {
      console.error('Error initializing socket:', error);
    }
  }

  joinTrip(tripId) {
    if (this.socket) {
      this.socket.emit('joinTrip', tripId);
    }
  }

  leaveTrip(tripId) {
    if (this.socket) {
      this.socket.emit('leaveTrip', tripId);
    }
  }

  updatePosition(data) {
    if (this.socket) {
      this.socket.emit('updatePosition', data);
    }
  }

  onPositionUpdate(callback) {
    if (this.socket) {
      this.socket.on('positionUpdate', callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new SocketService();
