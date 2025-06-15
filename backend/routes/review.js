const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// ✅ Create a new review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('❌ Error saving review:', err);
    res.status(500).json({ message: 'Failed to save review' });
  }
});

// ✅ Get all reviews for a specific movie by IMDb ID
router.get('/:imdbID', async (req, res) => {
  try {
    const reviews = await Review.find({ imdbID: req.params.imdbID });
    res.json(reviews);
  } catch (err) {
    console.error('❌ Error fetching reviews:', err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// ✅ Update a review by review ID
router.put('/:id', async (req, res) => {
  try {
    const { comment, rating } = req.body;

    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    review.comment = comment ?? review.comment;
    review.rating = rating ?? review.rating;

    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (err) {
    console.error('❌ Error updating review:', err);
    res.status(500).json({ message: 'Failed to update review' });
  }
});

// ✅ Delete a review by review ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) return res.status(404).json({ message: 'Review not found' });

    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('❌ Error deleting review:', err);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

module.exports = router;
