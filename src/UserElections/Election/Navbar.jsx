import React from 'react';
import './Navbar.css';
import { CssBaseline } from '@mui/material';

const Navbar = ({ setActiveSection, title }) => {

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <>
      <CssBaseline />
      <nav className="navbar">
          <div className='navbar-title-section'>
            <button className="go-back-button" onClick={handleGoBack}>Volver</button>
              <p className="navbar-title">{title}</p>
          </div>
          <ul className="nav-items">
              <li className="nav-item" onClick={() => setActiveSection('info')}>Info</li>
              <li className="nav-item" onClick={() => setActiveSection('parties')}>Partidos</li>
              <li className="nav-item" onClick={() => setActiveSection('lists')}>Formulas</li>
              <li className="nav-item" onClick={() => setActiveSection('tables')}>Mesas</li>
              <li className="nav-item" onClick={() => setActiveSection('voters')}>Votantes</li>
              <li className="nav-item" onClick={() => setActiveSection('authorities')}>Autoridades</li>
          </ul>
      </nav>
    </>
  );
};

export default Navbar;