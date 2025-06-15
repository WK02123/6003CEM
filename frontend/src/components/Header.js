import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ email }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  // ✅ Extract username from email (before @)
  const username = email ? email.split('@')[0] : '';

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      padding: '15px 25px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}>
      <h2>🎬 Movie Explorer</h2>
      <div>
        {username && <span style={{ marginRight: '20px' }}>Welcome, {username}!</span>}
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            background: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
