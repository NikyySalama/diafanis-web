import React from 'react';
import '../CSS/Card.css';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';


const Card = ({ id, title, imageUrl }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    sessionStorage.setItem('electionId', id); 
    navigate(`/election/`);
  };
 

  return (
    <>
      {imageUrl ? (
        <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
          <img src={imageUrl} alt='' className="card-img"/>
          <div className="container-title">
            <Typography className='card-title' variant="h6" sx={{ margin: 0, padding: 0 }}>{title}</Typography>
          </div>
        </div>
      ) : (
        <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
          <Typography className='card-titleAlone' variant="h4" sx={{ margin: 0, padding: 0 }}>{title}</Typography>
        </div>
      )}
    </>
  );
};



export default Card;
