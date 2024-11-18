const Booking = require('../models/bookingModel');
const ParkingSpace = require('../models/parkingSpaceModel');

exports.createBooking = async (req, res) => {
  try {
    const { parkingSpaceId, startTime, endTime, vehicleType, cityName } = req.body;
    const userId = req.user.id;  // Ensure req.user contains authenticated user information

    // Validate required fields
    if (!parkingSpaceId || !startTime || !endTime || !vehicleType || !cityName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate vehicle type
    if (vehicleType !== '2wheeler' && vehicleType !== '4wheeler') {
      return res.status(400).json({ message: 'Invalid vehicle type' });
    }

    // Check if the parking space exists and has available spots
    const parkingSpace = await ParkingSpace.findById(parkingSpaceId);
    if (!parkingSpace) {
      return res.status(404).json({ message: 'Parking space not found' });
    }

    const availableSpots = vehicleType === '2wheeler' 
      ? parkingSpace.no_of_2_wheeler_parking 
      : parkingSpace.no_of_4_wheeler_parking;

    if (availableSpots <= 0) {
      return res.status(400).json({ message: 'No available parking spots' });
    }

    // Calculate total cost (you can adjust this logic based on your pricing structure)
    const hours = Math.abs(new Date(endTime) - new Date(startTime)) / 36e5;
    const ratePerHour = vehicleType === '2wheeler' ? parkingSpace.rate_2_wheeler : parkingSpace.rate_4_wheeler;
    const totalCost = hours * ratePerHour;

    // Create the booking entry
    const newBooking = new Booking({
      user_id: userId,
      parking_space_id: parkingSpaceId,
      start_time: startTime,
      end_time: endTime,
      total_cost: totalCost,
      status: 'booked',  // assuming status is 'booked' upon creation
      city_name: cityName,
      created_at: new Date()
    });

    // Save the booking to the database
    await newBooking.save();

    // Update available parking spots
    if (vehicleType === '2wheeler') {
      parkingSpace.no_of_2_wheeler_parking -= 1;
    } else {
      parkingSpace.no_of_4_wheeler_parking -= 1;
    }
    await parkingSpace.save();

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: 'Booking creation failed: ' + error.message });
  }
};
