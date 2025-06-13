const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Create Review
router.post('/', async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('Error saving review:', err);
    res.status(500).json({ message: 'Failed to save review' });
  }
});

// Get all reviews for a specific movie
router.get('/:imdbID', async (req, res) => {
  try {
    const reviews = await Review.find({ imdbID: req.params.imdbID });
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Edit review
router.put('/:id', async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedReview);
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ message: 'Failed to update review' });
  }
});

// Delete review
router.delete('/:id', async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ message: 'Failed to delete review' });
  }
});

module.exports = router;
