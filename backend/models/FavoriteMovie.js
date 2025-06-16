const mongoose = require('mongoose');

const favoriteMovieSchema = new mongoose.Schema({
  movieId: Number,
  title: String,
  poster_path: String,
  release_date: String,
  vote_average: Number,
  userEmail: String // ✅ this must exist
});

module.exports = mongoose.model('FavoriteMovie', favoriteMovieSchema);
