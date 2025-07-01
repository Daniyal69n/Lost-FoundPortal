import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// Helper to decode JWT and get username
function parseJwt(token) {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = token ? parseJwt(token) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark position-absolute w-100" style={{ 
      zIndex: 10,
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      backgroundColor: 'rgba(0, 0, 0, 0.5) !important'
    }}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link className="navbar-brand text-white" to="/">Lost & Found</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navMenu" 
          aria-controls="navMenu" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="flex-grow-1 text-center">
          {user && (
            <span className="text-white" style={{ fontWeight: 500, fontSize: '1.1rem' }}>
              WELCOME, {user.username}
            </span>
          )}
        </div>
        <div className="collapse navbar-collapse justify-content-end" id="navMenu">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link text-white nav-blur" to="/">Home</Link>
            </li>
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white nav-blur" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white nav-blur" to="/register">Register</Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <Link className="nav-link text-white nav-blur" to="/report">Report</Link>
            </li>
            {user && (
              <li className="nav-item">
                <button className="btn btn-danger ms-3" onClick={handleLogout} style={{ fontWeight: 500 }}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;