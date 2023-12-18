// App.js
import React, { useState, useContext } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Frontend/Home';
import Login from './Frontend/Login';
import Patienten from './Frontend/Patienten';
import { UserContext } from './Frontend/UserContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Zustand für den Login-Status
  const { accessRights } = useContext(UserContext); // Zugriff auf die Rechte aus dem UserContext

  const handlePatientenClick = () => {
    if (!accessRights.includes('patienten')) {
      const confirmed = window.confirm('Ohne Login kein Zugriff. Möchten Sie sich anmelden?');
      if (confirmed) {
        navigate('/login');
      }
    } else {
      navigate('/patienten');
    }
  };

  const handleLogin = (username, password) => {
    // Beispiel für eine einfache Authentifizierungslogik
    if (username === 'user' && password === 'pass') {
      setIsLoggedIn(true); // Setzt den Login-Status auf true
      navigate('/');
    } else {
      alert('Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldeinformationen.');
    }
  };

  return (
    <div>
      <div className="navbar">
        <div className="nav-links">
          <Link to="/" className="navto">
            Home
          </Link>
          <Link to="/login" className="navto">
            Login
          </Link>
          <button onClick={handlePatientenClick} className="navto">
            Patientendaten
          </button>
        </div>
      </div>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/patienten" element={<Patienten />} />
          {/* Fügen Sie hier Routen für Ärzte, Abteilungen, Zimmer, Behandlungen hinzu */}
        </Routes>
      </div>
    </div>
  );
};

export default Navbar;
