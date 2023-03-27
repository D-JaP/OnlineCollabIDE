const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/login.js');
const registrationRoutes = require('./routes/registration.js')

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/', registrationRoutes);
app.use('/', authRoutes);


module.exports = app;