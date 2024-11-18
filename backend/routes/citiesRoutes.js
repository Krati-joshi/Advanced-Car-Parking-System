const express = require('express');
const router = express.Router();

router.get('/api/cities', async (req, res) => {
  try {
    // Assuming you're using Supabase, adjust this query as needed
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('city_name')
      .distinct();

    if (error) throw error;

    const cities = data.map(item => item.city_name);
    res.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});

module.exports = router;