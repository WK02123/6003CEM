import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './MovieList.css';  // reuse your CSS

const MovieDetails = () => {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    user: '',
    comment: '',
    rating: 0
  });

  useEffect(() => {
    // Fetch OMDb data from your backend
    axios.get(`http://localhost:5000/api/omdb/${imdbID}`)
      .then(res => setMovie(res.data))
      .catch(err => console.error(err));

    // Fetch existing reviews from backend
    axios.get(`http://localhost:5000/api/reviews/${imdbID}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));
  }, [imdbID]);

  const handleReviewSubmit = () => {
    axios.post('http://localhost:5000/api/reviews/', { ...newReview, imdbID })
      .then(res => {
        setReviews([...reviews, res.data]);
        setNewReview({ user: '', comment: '', rating: 0 });
      })
      .catch(err => console.error(err));
  };

  if (!movie) return <p>Loading movie details...</p>;

  return (
    <div className="movie-list">
      <h2>{movie.Title}</h2>
      <img src={movie.Poster} alt={movie.Title} style={{ width: '300px', borderRadius: '10px' }} />

      <p><strong>Plot:</strong> {movie.Plot}</p>
      <p><strong>Actors:</strong> {movie.Actors}</p>
      <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
      <p><strong>Rotten Tomatoes:</strong> {
        movie.Ratings?.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A'
      }</p>

      <h3>Submit Your Review</h3>
      <input
        type="text"
        placeholder="Your Name"
        value={newReview.user}
        onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
      /><br />
      <textarea
        placeholder="Your Comment"
        value={newReview.comment}
        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
      /><br />
      <input
        type="number"
        placeholder="Rating (1-10)"
        value={newReview.rating}
        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
      /><br />
      <button onClick={handleReviewSubmit}>Submit Review</button>

      <h3>Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map(r => (
          <div key={r._id} className="review-card">
            <p><strong>{r.user}</strong>: {r.comment} ({r.rating}/10)</p>
          </div>
        ))
      )}
    </div>
  );
};

export default MovieDetails;
