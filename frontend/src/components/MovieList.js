import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MovieList.css';
import { useNavigate } from 'react-router-dom';

const genres = [
  { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' }, { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' }, { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' }, { id: 53, name: 'Thriller' }
];

const MovieList = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/api/movies/trending')
      .then((response) => setMovies(response.data.results))
      .catch((error) => console.error('Fetch error:', error));
  }, []);

  const handleViewDetails = async (movie) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );

      const imdbID = response.data.imdb_id;

      if (imdbID) {
        navigate(`/movie/${imdbID}`);
      } else {
        alert("IMDb ID not found for this movie.");
      }
    } catch (error) {
      console.error("Failed to fetch IMDb ID:", error);
      alert("Error loading movie details.");
    }
  };

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
    axios.post('http://localhost:5000/api/movies/favorite', {
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average
    })
    .then(() => alert(`Saved "${movie.title}" to favorites!`))
    .catch((err) => {
      console.error('Failed to save:', err);
      alert('Failed to save movie.');
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTrailerKey(null);
  };

  const filteredMovies = selectedGenre === 'all'
    ? movies
    : movies.filter(movie => movie.genre_ids.includes(parseInt(selectedGenre)));

  return (
    <div className="movie-list">
      <h2>Trending Movies</h2>

      {/* Genre Filter Dropdown */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Filter by Genre:</label>
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}
          style={{ padding: '10px', borderRadius: '8px', fontSize: '1rem' }}>
          <option value="all">All</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>

      <div className="movie-grid">
        {filteredMovies.map(movie => (
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
            <button onClick={() => handleViewDetails(movie)} style={{ marginTop: '10px', backgroundColor: '#4CAF50' }}>
              View Details
            </button>
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
