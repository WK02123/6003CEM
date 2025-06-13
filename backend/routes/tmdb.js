const express = require('express');
const router = express.Router();
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;  

router.get('/:movieID', async (req, res) => {
  const { movieID } = req.params;
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieID}?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('TMDB fetch error:', error);
    res.status(500).json({ message: 'Failed to fetch TMDB movie details' });
  }
});

module.exports = router;
