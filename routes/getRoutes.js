const express = require('express');
const router = express.Router();

// Public Routes
router.get('/', (req, res) => {
    res.render('client/index');
});

// Auth Routes
router.get('/login', (req, res) => {
    res.render('client/login');
});

router.get('/register', (req, res) => {
    res.render('client/register');
});

module.exports = router;