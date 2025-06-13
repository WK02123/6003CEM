// ✅ Add this line at the top
console.log("🚀 Server file started...");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const movieRoutes = require('./routes/movies');
const omdbRoutes = require('./routes/omdb');
const reviewRoutes = require('./routes/review');
const tmdbRoutes = require('./routes/tmdb');  // ✅ ✅ Add TMDB route

// ✅ Initialize express app first
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes AFTER app initialized
app.use('/api/movies', movieRoutes);
app.use('/api/omdb', omdbRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/tmdb', tmdbRoutes);  // ✅ ✅ Register TMDB route

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT}`);
  });
})
.catch(err => console.error('❌ MongoDB connection error:', err));
