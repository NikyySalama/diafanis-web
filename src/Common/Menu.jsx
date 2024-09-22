import React from 'react';
import './Menu.css';
import isotipo from './Isotipo.png' 
import { useNavigate } from 'react-router-dom';
const Menu = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/`);
  };
  const handleClickUser = () => {
    navigate(`/userElections`);
  };



  return (
    <div className="menu">
        <img className="diafanis-icon" src={isotipo} onClick={handleClick} ></img>
        <h1 className="diafanis" onClick={handleClick} >Diafanis</h1>
        <button className="my-elections-button" onClick={handleClickUser}>Mis elecciones</button>
    </div>
  );
};

export default Menu;