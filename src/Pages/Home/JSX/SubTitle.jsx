import React from 'react';
import '../CSS/SubTitle.css';
import Typography from '@mui/material/Typography';



const SubTitle = () => {
  return (
    <div className="subTitle">
      <Typography 
        sx={{ 
          margin: '0', 
          marginLeft: '4vw', 
          width: 'fit-content', 
          color: 'var(--primary-color)', 
          fontSize: '1.7em'
        }} 
        variant="body1"
      >
        Elecciones activas
      </Typography>
    </div>
  );
};


export default SubTitle;
