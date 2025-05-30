const mongoose = require('mongoose');

const FavoriteMovieSchema = new mongoose.Schema({
  movieId: Number,
  title: String,
  poster_path: String,
  release_date: String,
  vote_average: Number
});

module.exports = mongoose.model('FavoriteMovie', FavoriteMovieSchema);
