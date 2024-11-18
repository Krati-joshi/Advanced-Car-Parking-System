const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parkingController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authMiddleware to protect all routes
router.use(authMiddleware);

// Route to get all parking spaces
router.get('/', parkingController.getAllParkingSpaces);

// Route to get parking spaces by ID
router.get('/:id', parkingController.getParkingSpaceById);

// Route to get parking spaces by city name
router.get('/city/:cityName', parkingController.getParkingSpacesByCity);

// Route to create a new parking space
router.post('/', parkingController.createParkingSpace);

// Route to get parking spaces visibility grouped by city
router.get('/visibility', parkingController.getParkingSpacesVisibility);

module.exports = router;