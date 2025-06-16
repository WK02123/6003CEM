const express = require('express');
const router = express.Router();
const { getTrendingMovies } = require('../controllers/movieController');
const FavoriteMovie = require('../models/FavoriteMovie');

// ✅ Trending movies
router.get('/trending', getTrendingMovies);

// ✅ Save a movie to favorites
router.post('/favorite', async (req, res) => {
  try {
    const { movieId, title, poster_path, release_date, vote_average, userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ message: 'Missing userEmail in request body' });
    }

    const newFavorite = new FavoriteMovie({
      movieId,
      title,
      poster_path,
      release_date,
      vote_average,
      userEmail
    });

    await newFavorite.save();
    res.status(201).json({ message: 'Movie saved to favorites' });
  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({ message: 'Failed to save movie' });
  }
});

// ✅ Get favorite movies for a user
router.get('/favorite', async (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ message: 'Missing userEmail in query' });
  }

  try {
    const favorites = await FavoriteMovie.find({ userEmail });
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/favorite', async (req, res) => {
  const { userEmail, movieId } = req.query;

  if (!userEmail || !movieId) {
    return res.status(400).json({ message: 'Missing userEmail or movieId in query' });
  }

  try {
    const result = await FavoriteMovie.deleteOne({ userEmail, movieId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Favorite movie not found' });
    }

    res.json({ message: 'Movie removed from favorites' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete movie' });
  }
});




module.exports = router;





