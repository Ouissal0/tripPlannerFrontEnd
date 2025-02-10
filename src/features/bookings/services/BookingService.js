import api from '../../../config/api.config';

class BookingService {
  async createBooking(tripId) {
    try {
      const response = await api.post('/bookings', { trip: tripId });
      return response.data;
    } catch (error) {
      console.error('Booking error:', error.response?.data || error.message);
      throw error;
    }
  }

  async getMyBookings() {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data;
    } catch (error) {
      console.error('Get bookings error:', error.response?.data || error.message);
      throw error;
    }
  }

  async cancelBooking(bookingId) {
    try {
      const response = await api.delete(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Cancel booking error:', error.response?.data || error.message);
      throw error;
    }
  }
}

export default new BookingService();
