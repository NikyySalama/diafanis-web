import React from 'react';
import './Menu.css';
import isotipo from './Isotipo.png' 
import userIcon from './userIcon.png' 
import { useNavigate } from 'react-router-dom';
const Menu = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/`, {
     
    });
  };
  const handleClickUser = () => {
    navigate(`/`, {
     
    });
  };



  return (
    <div className="menu">
        <img className="diafanis-icon" src={isotipo} onClick={handleClick} style={{ cursor: 'pointer' }} ></img>
        <h1 className="diafanis" onClick={handleClick} style={{ cursor: 'pointer' }} >Diafanis</h1>
        <div className="button" onClick={handleClickUser} style={{ cursor: 'pointer' }}><h1 className='button-text'>Mis elecciones</h1></div>
    </div>
  );
};

export default Menu;
  /*   <img className="user" src={userIcon}></img> */