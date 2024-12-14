import React from 'react';
import './Footer.css';
import Typography from '@mui/material/Typography';
import { Box } from "@mui/material";
const Footer = () => {
  return (
    <Box sx={{
      width: '100%',
      backgroundColor: '#D3D3D3',
      padding: '1em 0',
      textAlign: 'center',
      boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
    }} >
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
    </Box>
  );
}  

export default Footer;
