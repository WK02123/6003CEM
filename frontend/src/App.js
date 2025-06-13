import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';  // ✅ Use correct file name

function App() {
  return (
    <Router>
      <div className="App">
        <h1>🎬 Movie Explorer</h1>

        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
