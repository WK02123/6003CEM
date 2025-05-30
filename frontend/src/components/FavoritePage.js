import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieList.css';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies/trending')
      .then((response) => {
        setMovies(response.data.results);
      })
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  const fetchTrailer = async (movieId) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );

      const trailer = res.data.results.find(video =>
        video.type === 'Trailer' &&
        video.site === 'YouTube' &&
        (video.name.toLowerCase().includes('official') || video.official)
      );

      if (trailer) {
        setTrailerKey(trailer.key);
        setIsModalOpen(true);
      } else {
        alert('Trailer not found');
      }
    } catch (err) {
      console.error('Error fetching trailer:', err);
      alert('Failed to load trailer');
    }
  };

  const handleSaveFavorite = (movie) => {
    alert(`Saved "${movie.title}" to favorites!`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrailerKey(null);
  };

  return (
    <div className="movie-list">
      <h2>Trending Movies</h2>
      <div className="movie-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              onClick={() => fetchTrailer(movie.id)}
              style={{ cursor: 'pointer' }}
            />
            <h3>{movie.title}</h3>
            <p>📅 Release: {movie.release_date}</p>
            <p>⭐ Rating: {movie.vote_average}</p>
            <button onClick={() => handleSaveFavorite(movie)}>Save to Favorites</button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>✖</button>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              title="YouTube Trailer"
              frameBorder="0"
              allow="autoplay; encrypted-media"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;

