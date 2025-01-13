const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const hootsRouter = require('./controllers/hoots.js');
const profilesRouter = require('./controllers/profiles');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/hoots', hootsRouter);

// Port configuration for Heroku and local development
const PORT = process.env.PORT || 3000;  // Fallback to 3000 for local testing
app.listen(PORT, () => {
    console.log(`The express app is ready on port ${PORT}!`);
});
