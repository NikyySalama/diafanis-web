import React from 'react';
import '../CSS/ItemMesa.css';
import Typography from '@mui/material/Typography';


import { useNavigate } from 'react-router-dom';

const ItemMesa = ({uuid}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    localStorage.setItem('tableUuid', uuid); 
    navigate(`/election/table`);
  };
  
  return (
    <div className="table-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <Typography color='var(--primary-color)' variant='h4' className='table-mesa'>Mesa</Typography>
        <Typography color='var(--primary-color)' sx={{ marginLeft: '1%' }} variant='body2' className='uuid'>{uuid}</Typography>
    </div>
  )};

export default ItemMesa;