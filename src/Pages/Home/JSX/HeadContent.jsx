import React from "react";
import '../CSS/HeadContent.css'
import Typography from '@mui/material/Typography';
import { makeStyles} from '@mui/styles';
import Box from '@mui/material/Box';
const useStyles = makeStyles({
  headContent: {
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50%',
    height: '50%',
    maxHeight: '50%',
    width: '100%', 
    backgroundColor: '#020246',
  },
  headContentTitle: {
    margin: 0, // Remove default margins to avoid unexpected spacing
    color: '#EFF0F7',
    fontSize: 'calc(1.5rem + 3vw + 0.25vh)',
    height: 'fit-content',
  },
  headContentText: {
    margin: 0, // Remove default margins to avoid unexpected spacing
    color: '#EFF0F7',
    fontSize: 'calc(0.5rem + 0.5vw + 0.25vh)',
    height: 'fit-content',
  },
});

const HeadContent = () => {
  const classes = useStyles();
    return (
      <div color="primary2" className="HeadContent" style={{  backgroundColor: '#020246' }} >
        <Typography   className={'HeadContent-title h1'} color="back" variant="h3">Bienvenido a Diafanis</Typography>
        <Typography  className={'HeadContent-text h4'}  color="back" variant="h6">Su sistema de votacion de confianza</Typography>
      </div>
    );
  };
export default HeadContent