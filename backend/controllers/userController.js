const { sign } = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// User login function
exports.login = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) throw error;
        
        const token = sign({ userId: data.user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: data.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// User registration function
exports.registerUser = async (req, res) => {
    const { email, password, name } = req.body;
    
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name },
            },
        });
        
        if (authError) throw authError;
        
        // Insert user data into Supabase 'users' table
        const { data: userData, error: profileError } = await supabase
            .from('users')
            .insert([{ uid: authData.user.id, email, name }]);
        
        if (profileError) {
            // If profile creation fails, delete the auth user
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw new Error('Profile creation failed: ' + profileError.message);
        }
        
        res.status(201).json({ message: 'User registered successfully', user: userData[0] });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
};

// Fetch user profile function
exports.getUserProfile = async (req, res) => {
    try {
        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('uid', req.user.id)
            .single();
        
        if (error) throw error;
        
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update user profile function
exports.updateUserProfile = async (req, res) => {
    const { name, phone_number } = req.body;
    
    try {
        const { data, error } = await supabase
            .from('users')
            .update({ name, phone_number })
            .eq('uid', req.user.id);
        
        if (error) throw error;
        
        res.status(200).json({ message: 'Profile updated successfully', data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create user function (if needed separately from registration)
exports.createUser = async (req, res) => {
    const { name, email, uid } = req.body;
    
    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{ name, email, uid }]);
        
        if (error) throw error;
        
        res.status(201).json({ message: 'User profile created successfully', user: data[0] });
    } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ message: 'Error creating user profile', error: error.message });
    }
};