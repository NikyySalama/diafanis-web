import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import isotipo from '../../Common/Isotipo.png';

import InfoOutlined from '@mui/icons-material/InfoOutlined';
import GroupsOutlined from '@mui/icons-material/GroupsOutlined';
import HowToVoteOutlined from '@mui/icons-material/HowToVoteOutlined';
import TableChartOutlined from '@mui/icons-material/TableChartOutlined';
import PersonOutline from '@mui/icons-material/PersonOutline';
import GavelOutlined from '@mui/icons-material/GavelOutlined';

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

  const handleGoHome = () => {
    navigate('/');
  }

  return (
    <>
      <CssBaseline />
      {/* Barra superior */}
      <div className="top-bar">
        <button className="hamburger-button" onClick={toggleSidebar}>
          &#9776;
        </button>
        <img className="navbar-logo" src={isotipo} alt="Isotipo" onClick={handleGoHome} />
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
          <li className={`nav-item ${activeItem === 'info' ? 'active' : ''}`} onClick={() => handleItemClick('info')}>
            <InfoOutlined className="nav-icon" /> Info
          </li>
          <li className={`nav-item ${activeItem === 'parties' ? 'active' : ''}`} onClick={() => handleItemClick('parties')}>
            <GroupsOutlined className="nav-icon" /> Partidos
          </li>
          <li className={`nav-item ${activeItem === 'lists' ? 'active' : ''}`} onClick={() => handleItemClick('lists')}>
            <HowToVoteOutlined className="nav-icon" /> Formulas
          </li>
          <li className={`nav-item ${activeItem === 'tables' ? 'active' : ''}`} onClick={() => handleItemClick('tables')}>
            <TableChartOutlined className="nav-icon" /> Mesas
          </li>
          <li className={`nav-item ${activeItem === 'voters' ? 'active' : ''}`} onClick={() => handleItemClick('voters')}>
            <PersonOutline className="nav-icon" /> Votantes
          </li>
          <li className={`nav-item ${activeItem === 'authorities' ? 'active' : ''}`} onClick={() => handleItemClick('authorities')}>
            <GavelOutlined className="nav-icon" /> Autoridades
          </li>
        </ul>
      </div>

      {/* Fondo oscuro */}
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}
    </>
  );
};

export default Navbar;