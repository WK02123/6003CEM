import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './MovieDetails.css';

const MovieDetails = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 0 });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const userEmail = localStorage.getItem('userEmail');
  const username = userEmail ? userEmail.split('@')[0] : 'Guest';

  useEffect(() => {
    axios.get(`http://localhost:5000/api/omdb/${imdbID}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));

    fetchReviews();
  }, [imdbID]);

  const fetchReviews = () => {
    axios.get(`http://localhost:5000/api/reviews/${imdbID}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  };

  const handleSubmit = () => {
    if (newReview.rating < 0 || newReview.rating > 10) {
      alert('Rating must be between 0 and 10');
      return;
    }

    if (editingReviewId) {
      axios.put(`http://localhost:5000/api/reviews/${editingReviewId}`, {
        comment: newReview.comment,
        rating: newReview.rating
      }).then(() => {
        fetchReviews();
        setEditingReviewId(null);
        setNewReview({ comment: '', rating: 0 });
      }).catch(console.error);
    } else {
      axios.post('http://localhost:5000/api/reviews', {
        user: username,
        comment: newReview.comment,
        rating: newReview.rating,
        imdbID
      }).then(res => {
        setReviews([...reviews, res.data]);
        setNewReview({ comment: '', rating: 0 });
      }).catch(console.error);
    }
  };

  const handleEdit = (review) => {
    setNewReview({ comment: review.comment, rating: review.rating });
    setEditingReviewId(review._id);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/reviews/${id}`)
      .then(() => fetchReviews())
      .catch(console.error);
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="movie-details">
      <h2>{movie.Title}</h2>
      <img src={movie.Poster} alt={movie.Title} />

      <p><strong>Plot:</strong> {movie.Plot}</p>
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
      <p><strong>Rotten Tomatoes:</strong> {
        movie.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A'
      }</p>

      <h3>{editingReviewId ? 'Edit Review' : 'Submit Your Review'}</h3>
      <textarea
        placeholder="Your Comment"
        value={newReview.comment}
        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
      /><br />
      <input
        type="number"
        placeholder="Rating (0-10)"
        value={newReview.rating}
        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
        min={0}
        max={10}
      /><br />
      <button onClick={handleSubmit}>{editingReviewId ? 'Update Review' : 'Submit Review'}</button>

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(r => (
          <div key={r._id} className="review-card">
            <p><strong>{r.user}</strong>: {r.comment} ({r.rating}/10)</p>
            {r.user === username && (
              <>
                <button onClick={() => handleEdit(r)} style={{ marginRight: '10px' }}>Edit</button>
                <button onClick={() => handleDelete(r._id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MovieDetails;
