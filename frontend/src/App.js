import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import FavoritesPage from './components/FavoritesPage'; // ✅ Import the FavoritesPage component

// Auth check function
const isAuthenticated = () => !!localStorage.getItem('token');

// Protected Route Wrapper with Header
const PrivateRouteWithHeader = ({ children }) => {
  const email = localStorage.getItem('userEmail'); // ✅ Get user email from localStorage
  return isAuthenticated() ? (
    <>
      <Header email={email} /> {/* ✅ Show header when authenticated */}
      {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <PrivateRouteWithHeader>
                <MovieList />
              </PrivateRouteWithHeader>
            }
          />
          <Route
            path="/movie/:imdbID"
            element={
              <PrivateRouteWithHeader>
                <MovieDetail />
              </PrivateRouteWithHeader>
            }
          />
          <Route
            path="/favorites"
            element={
              <PrivateRouteWithHeader>
                <FavoritesPage />
              </PrivateRouteWithHeader>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
