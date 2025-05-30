const express = require('express');
const router = express.Router();
const { getTrendingMovies } = require('../controllers/movieController');

router.get('/trending', getTrendingMovies);

module.exports = router;  // ✅ This line is CRUCIAL

const FavoriteMovie = require('../models/FavoriteMovie');

router.post('/favorite', async (req, res) => {
  try {
    const { movieId, title, poster_path, release_date, vote_average } = req.body;
    const movie = new FavoriteMovie({ movieId, title, poster_path, release_date, vote_average });
    await movie.save();
    res.status(201).json({ message: 'Movie saved to favorites' });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ message: 'Failed to save movie' });
  }
});


