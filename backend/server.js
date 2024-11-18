require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const parkingSpaceRoutes = require('./routes/parkingSpaceRoutes');
const citiesRoutes = require('./routes/citiesRoutes');
const userController = require('./controllers/userController');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/parking-spaces', authMiddleware, parkingSpaceRoutes);
app.use('/api/cities', citiesRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// User authentication routes
app.post('/api/register', userController.registerUser);
app.post('/api/login', userController.login);
app.get('/api/profile', authMiddleware, userController.getUserProfile);
app.put('/api/profile', authMiddleware, userController.updateUserProfile);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
