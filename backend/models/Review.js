const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  imdbID: { type: String, required: true },
  user: { type: String, required: true },
  comment: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
