const axios = require('axios');

const getTrendingMovies = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching movies:', error);
    res.status(500).json({ message: 'Failed to fetch trending movies' });
  }
};

module.exports = { getTrendingMovies };
