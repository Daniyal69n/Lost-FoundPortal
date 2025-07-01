import React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        navigate('/');
        // Optionally save token: localStorage.setItem('token', data.token);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Error logging in');
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center" style={{ 
      minHeight: '100vh', 
      background: 'aliceblue', 
      marginTop: '24px',
    }}>
      <div className="row w-100 justify-content-center">
        <div className="col-12 d-flex justify-content-center">
          <div className="card shadow" style={{ 
            maxWidth: '400px', 
            width: '100%', 
            padding: '32px 24px', 
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}>
            <div className="card-body p-0">
              <h3 className="text-center mb-4" style={{ fontWeight: 700 }}>Login</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Login</button>
                </div>
              </form>
              <div className="text-center mt-3">
                <p className="mb-1">
                  Don't have an account?
                </p>
                <Link to="/register">Register here</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 