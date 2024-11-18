import { supabase } from '../config/supabase';

export const bookingRoutes = {
  createBooking: async (req, res) => {
    const { parking_space_id, start_time, end_time, user_id, total_cost } = req.body;
    
    if (!parking_space_id || !start_time || !end_time || !user_id || total_cost === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert([{ parking_space_id, start_time, end_time, user_id, total_cost, status: 'pending' }])
        .select();

      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (err) {
      console.error('Booking creation error:', err.message);
      res.status(500).json({ error: 'Failed to create booking' });
    }
  },

  getAllBookings: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, parking_spaces(*), users(*)')
        .order('start_time', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error('Error fetching all bookings:', err.message);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  },

  getBookingById: async (req, res) => {
    const { id } = req.params;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, parking_spaces(*), users(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(data);
    } catch (err) {
      console.error('Error fetching booking by ID:', err.message);
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  },

  updateBooking: async (req, res) => {
    const { id } = req.params;
    const { parking_space_id, start_time, end_time, total_cost, status } = req.body;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ parking_space_id, start_time, end_time, total_cost, status })
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(data[0]);
    } catch (err) {
      console.error('Error updating booking:', err.message);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  },

  deleteBooking: async (req, res) => {
    const { id } = req.params;

    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
      console.error('Error deleting booking:', err.message);
      res.status(500).json({ error: 'Failed to delete booking' });
    }
  },

  getUserBookings: async (req, res) => {
    const { userId } = req.params;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, parking_spaces(*)')
        .eq('user_id', userId)
        .order('start_time', { ascending: false });

      if (error) throw error;
      res.json(data);
    } catch (err) {
      console.error('Error fetching user bookings:', err.message);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  }
};