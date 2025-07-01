import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; //handle-client routing
import Navbar from './components/Navbar';
import HeaderBanner from './components/HeaderBanner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Report from './pages/Report';
import Chat from './pages/Chat';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AppContent() {
  const location = useLocation();
  return (
    <div className="App">
      <Navbar /> {/* render Navbar */}
      <HeaderBanner home={location.pathname === '/'} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report" element={<Report />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
