// backend/controllers/authController.js

const { supabase } = require('../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Input validation here

  try {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user in Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: hashedPassword,
      options: { data: { name, role } },
    });

    if (authError) return res.status(400).json({ error: authError.message });

    // Store user in 'users' table
    const { error: userError } = await supabase
      .from('users')
      .insert([{ email, name, role, uid: authData.user.id }]);

    if (userError) {
      // Cleanup if user insertion fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: userError.message });
    }

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate user with Supabase
    const { data, error } = await supabase.auth.signIn({ email, password });

    if (error) return res.status(400).json({ error: error.message });

    // Create a token for the authenticated user
    const token = jwt.sign({ id: data.user.id, email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

// Password reset and other auth-related functions can be added here...

module.exports = { registerUser, loginUser };
