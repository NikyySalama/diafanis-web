import React from 'react';
import '../CSS/Title.css';
import Typography from '@mui/material/Typography';
const Title = ({content}) => {
  return (
    <div className="title-container">
      <Typography color='var(--primary-color)' sx={{marginTop:'2%'}} variant="h4">{content}</Typography>
    </div>
  );
};

export default Title;
