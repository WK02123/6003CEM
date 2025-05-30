const axios = require('axios');

const getTrendingMovies = async (req, res) => {
  try {
    let allMovies = [];

    for (let page = 1; page <= 5; page++) {  // You can adjust how many pages you want
      const response = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=b0a273a6583c791b6b80a7efac52bdf2&page=${page}`
      );
      allMovies = allMovies.concat(response.data.results);
    }

    res.json({ results: allMovies });
  } catch (err) {
    console.error('Error fetching trending movies:', err);
    res.status(500).json({ message: 'Failed to fetch trending movies' });
  }
};

module.exports = { getTrendingMovies };

