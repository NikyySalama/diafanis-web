import React from 'react';
import './Navbar.css';

const Navbar = ({ setActiveSection, title }) => {
  return (
    <nav className="navbar">
        <ul className="nav-items">
            <p className="navbar-title">{title}</p>
            <li className="nav-item" onClick={() => setActiveSection('info')}>Info</li>
            <li className="nav-item" onClick={() => setActiveSection('lists')}>Listas</li>
            <li className="nav-item" onClick={() => setActiveSection('tables')}>Mesas</li>
        </ul>
    </nav>
  );
};

export default Navbar;