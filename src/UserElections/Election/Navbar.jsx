import React from 'react';
import './Navbar.css';

const Navbar = ({ setActiveSection, title }) => {
  return (
    <nav className="navbar">
        <div className='navbar-title-section'>
            <p className="navbar-title">{title}</p>
        </div>
        <ul className="nav-items">
            <li className="nav-item" onClick={() => setActiveSection('info')}>Info</li>
            <li className="nav-item" onClick={() => setActiveSection('parties')}>Partidos</li>
            <li className="nav-item" onClick={() => setActiveSection('lists')}>Formulas</li>
            <li className="nav-item" onClick={() => setActiveSection('tables')}>Mesas</li>
        </ul>
    </nav>
  );
};

export default Navbar;