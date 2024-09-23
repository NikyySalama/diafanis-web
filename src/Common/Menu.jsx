import React from 'react';
import './Menu.css';
import isotipo from './Isotipo.png' 
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
      <div className='menu-button' onClick={handleClick} style={{ cursor: 'pointer' }}>
        <img className="diafanis-icon" src={isotipo} alt="Isotipo" />
        <Typography color='var(--primary-color)' variant='h5' className="diafanis">Diafanis</Typography>
      </div>
      
      <Button 
        sx={{ 
          color: 'white', 
          backgroundColor: 'var(--primary-color)', 
          height: '80%', 
          padding: '0.5% 1%', 
         
          cursor: 'pointer', 
          
          fontSize: '1em', 
          marginLeft: 'auto', 
          fontFamily: 'Inter',
          fontWeight: 700,
        }} 
        variant="contained" 
        className="my-elections-button" 
        onClick={handleClickUser}
      >
        Mis elecciones
      </Button>
    </div>
  );
}
  
export default Menu;