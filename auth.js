const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/login.js');
const registrationRoutes = require('./routes/registration.js')
const inviteRoutes = require('./routes/invite')

const userRoutes = require('./routes/user.js')

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1', registrationRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', inviteRoutes)
app.use('/api/v1', userRoutes)

module.exports = app;