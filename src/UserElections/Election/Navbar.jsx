import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setActiveSection, title }) => {
  const [activeItem, setActiveItem] = useState('info'); // Estado para el elemento seleccionado

  const handleGoBack = () => {
    window.history.back();
  };
  const navigate = useNavigate();
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('jwt');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);

  // Manejador para cambiar el item activo
  const handleItemClick = (section) => {
    setActiveSection(section);
    setActiveItem(section);
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
          <li className={`nav-item ${activeItem === 'info' ? 'active' : ''}`} onClick={() => handleItemClick('info')}>Info</li>
          <li className={`nav-item ${activeItem === 'parties' ? 'active' : ''}`} onClick={() => handleItemClick('parties')}>Partidos</li>
          <li className={`nav-item ${activeItem === 'lists' ? 'active' : ''}`} onClick={() => handleItemClick('lists')}>Formulas</li>
          <li className={`nav-item ${activeItem === 'tables' ? 'active' : ''}`} onClick={() => handleItemClick('tables')}>Mesas</li>
          <li className={`nav-item ${activeItem === 'voters' ? 'active' : ''}`} onClick={() => handleItemClick('voters')}>Votantes</li>
          <li className={`nav-item ${activeItem === 'authorities' ? 'active' : ''}`} onClick={() => handleItemClick('authorities')}>Autoridades</li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;