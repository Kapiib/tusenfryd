const User = require('../models/User');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;
            
            // Check if password meets minimum length
            if (password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters long' });
            }
            
            // Check if user already exists
            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });
            
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            // Hash password
            const hashedPassword = await argon2.hash(password);
            
            // Create new user
            const user = new User({
                username,
                email,
                password: hashedPassword
            });
            
            await user.save();
            
            // Create JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            
            // Set token as cookie
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000 // 1 hour
            });
            
            res.status(201).json({ message: 'Registration successful' });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Registration failed' });
        }
    },
    
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            
            // Find the user
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            // Verify password
            const validPassword = await argon2.verify(user.password, password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            // Create JWT token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            
            // Set token as cookie
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000 // 1 hour
            });
            
            res.json({ message: 'Login successful' });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Login failed' });
        }
    },
    
    logout: (req, res) => {
        res.clearCookie('token');
        res.redirect('/login');
    }
};

module.exports = authController;