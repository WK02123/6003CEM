const express = require('express');
const router = express.Router();
const axios = require('axios');

const OMDB_API_KEY = process.env.OMDB_API_KEY;

router.get('/:imdbID', async (req, res) => {
  const { imdbID } = req.params;
  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&plot=full`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch OMDb data' });
  }
});

module.exports = router;
