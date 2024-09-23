import React from 'react';
import './Footer.css';
import Typography from '@mui/material/Typography';
const Footer = () => {
  return (
    <div className="footer">
      <Typography
        sx={{
          margin: '0 auto',
        
          color: 'var(--primary-color)',
          opacity: 1, // Opacity value should be a number between 0 and 1
        }}
        variant="body2"
      >
        Software distribuído por Diafanis Co. | Todos los derechos reservados
      </Typography>
    </div>
  );
}  

export default Footer;
