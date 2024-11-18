const supabase = require('../config/supabaseClient');

const parkingController = {
  getAllParkingSpaces: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('*');
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No parking spaces found' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching parking spaces:', error);
      res.status(500).json({ error: 'Failed to fetch parking spaces' });
    }
  },

  getParkingSpacesByCity: async (req, res) => {
    const { cityName } = req.params;
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('*')
        .ilike('city', `%${cityName}%`);
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return res.status(404).json({ message: `No parking spaces found in ${cityName}` });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching city parking spaces:', error);
      res.status(500).json({ error: 'Failed to fetch city parking spaces' });
    }
  },

  getParkingSpaceById: async (req, res) => {
    const { id } = req.params;
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        return res.status(404).json({ message: 'Parking space not found' });
      }
      
      res.json(data);
    } catch (error) {
      console.error('Error fetching parking space:', error);
      res.status(500).json({ error: 'Failed to fetch parking space' });
    }
  },

  createParkingSpace: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .insert([req.body])
        .select();
      
      if (error) throw error;
      res.status(201).json(data[0]);
    } catch (error) {
      console.error('Error creating parking space:', error);
      res.status(500).json({ error: 'Failed to create parking space' });
    }
  },

  getParkingSpacesVisibility: async (req, res) => {
    try {
      const { data, error } = await supabase
        .from('parking_spaces')
        .select('id, city, latitude, longitude, name, available_spaces')
        .order('city');

      if (error) throw error;

      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No parking spaces found' });
      }

      const groupedData = data.reduce((acc, space) => {
        if (!acc[space.city]) {
          acc[space.city] = [];
        }
        acc[space.city].push(space);
        return acc;
      }, {});

      res.json(groupedData);
    } catch (error) {
      console.error('Error fetching parking spaces visibility:', error);
      res.status(500).json({ error: 'Failed to fetch parking spaces visibility' });
    }
  },
};

module.exports = parkingController;