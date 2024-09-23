import React from "react";
import '../CSS/HeadContent.css'
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';


const HeadContent = () => {
 
    return (
      <div color="primary2" className="HeadContent" style={{  backgroundColor: '#020246' }} >
        <Typography   className={'HeadContent-title h1'} color="back" variant="h3">Bienvenido a Diafanis</Typography>
        <Typography  className={'HeadContent-text h4'}  color="back" variant="h6">Su sistema de votacion de confianza</Typography>
      </div>
    );
  };
export default HeadContent