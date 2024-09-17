import React from 'react';
//import '../Common/Menu.css';
import './NavbarUserElection.css'
import isotipo from '../Common//Isotipo.png' 
import { useNavigate } from 'react-router-dom';

const NavbarUserElection = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/`);
  };

  return (
    <div className="navbar-user-election">
      <div className="logo-with-name" onClick={handleClick}>
        <img className="diafanis-logo" src={isotipo}></img>
        <h1 className="diafanis-title">Diafanis</h1>
      </div>
    </div>
  );
};

export default NavbarUserElection;