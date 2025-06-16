import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieList.css';
import { useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movieOverviews, setMovieOverviews] = useState({});
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/movies/favorite?userEmail=${userEmail}`)
      .then((res) => {
        setFavorites(res.data);
        res.data.forEach((movie) => {
          fetchOverview(movie.movieId);
        });
      })
      .catch((err) => console.error('Error fetching favorites:', err));
  }, [userEmail]);

  const fetchOverview = async (movieId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      setMovieOverviews((prev) => ({
        ...prev,
        [movieId]: response.data.overview
      }));
    } catch (error) {
      console.error('Failed to fetch overview:', error);
    }
  };

  const handleViewDetails = async (movie) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      const imdbID = response.data.imdb_id;
      if (imdbID) {
        navigate(`/movie/${imdbID}`);
      } else {
        alert('IMDb ID not found.');
      }
    } catch (error) {
      console.error('Error getting movie details:', error);
    }
  };

  const fetchTrailer = async (movieId) => {
    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      const trailer = res.data.results.find(
        (video) =>
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
    }
  };

const handleRemoveFavorite = async (movieId) => {
  console.log("Deleting:", { movieId, userEmail });

  try {
    await axios.delete(
      `http://localhost:5000/api/movies/favorite?userEmail=${userEmail}&movieId=${movieId}`
    );

    setFavorites((prev) => prev.filter((m) => m.movieId !== movieId));
  } catch (err) {
    console.error('Failed to remove favorite:', err);
    alert('Failed to delete movie.');
  }
};




  const closeModal = () => {
    setIsModalOpen(false);
    setTrailerKey(null);
  };

  return (
    <div className="movie-list">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Your Favorite Movies</h2>
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#555',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ⬅ Back to Home
        </button>
      </div>

      <div className="movie-grid">
        {favorites.length === 0 ? (
          <p>You have no favorite movies yet.</p>
        ) : (
          favorites.map((movie) => (
            <div key={movie.movieId} className="movie-card">
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                onClick={() => fetchTrailer(movie.movieId)}
                style={{ cursor: 'pointer' }}
              />
              <h3>{movie.title}</h3>
              <p>📅 Release: {movie.release_date}</p>
              <p>⭐ Rating: {movie.vote_average}</p>
              <p style={{ fontSize: '0.85rem', color: '#ccc' }}>
                {movieOverviews[movie.movieId] || 'Loading overview...'}
              </p>

              <button
                onClick={() => handleViewDetails(movie)}
                style={{
                  backgroundColor: '#4CAF50',
                  marginTop: '10px',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                View Details
              </button>

              <button
                onClick={() => handleRemoveFavorite(movie.movieId)}
                style={{
                  backgroundColor: '#e60000',
                  marginTop: '10px',
                  color: 'white',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                🗑 Remove
              </button>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ✖
            </button>
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

export default FavoritesPage;
