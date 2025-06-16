import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ email }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="header">
      <div className="left-buttons">
        <button className="nav-btn" onClick={() => navigate('/home')}>🏠 Home</button>
        <button className="nav-btn" onClick={() => navigate('/favorites')}>⭐ Favorites</button>
      </div>
      <div className="right-info">
        <span className="user-email">{email}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;

