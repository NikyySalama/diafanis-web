import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import isotipo from '../../Common//Isotipo.png' 

const Navbar = ({ setActiveSection, title }) => {
  const [activeItem, setActiveItem] = useState('info');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleItemClick = (section) => {
    setActiveSection(section);
    setActiveItem(section);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <CssBaseline />
      {/* Barra superior */}
      <div className="top-bar">
        <button className="hamburger-button" onClick={toggleSidebar}>
          &#9776;
        </button>
        <img className="navbar-logo" src={isotipo}></img>
        <button className="go-back-button" onClick={handleGoBack}>
          Volver
        </button>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className='navbar-title-container'>
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
      </div>

      {/* Fondo oscuro para cerrar el sidebar al hacer clic fuera de él */}
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
};

export default Navbar;