// C:\Users\aanus\Desktop\AKSN-SEM7\car-parking-app\backend\src\config\controllers\parkingSpaceController.js
const supabase = require('../../config/supabase');

exports.getAllParkingSpaces = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_spaces')
      .select('*');

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add other controller methods as needed