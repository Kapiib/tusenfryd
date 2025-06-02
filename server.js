const express = require('express');
const app = express();
const connectDB = require('./db/dbConfig');
const cookieParser = require('cookie-parser');
const getRoutes = require('./routes/getRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up EJS view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Static files
app.use(express.static('public'));

// Routes
app.use(getRoutes);
app.use('/auth', authRoutes);

// Port
const PORT = process.env.PORT;
app.listen(PORT, () => {  
    console.log(`Running on http://localhost:${PORT}`);
});