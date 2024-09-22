import React from 'react';
import '../CSS/Card.css';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';

const useStyles = makeStyles({
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    height: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden', // Prevent child elements from overflowing
    display: 'flex',          
    justifyContent: 'center',
    alignItems: 'center',    
    flexDirection: 'column',
  },
  cardImg: {
    borderRadius: '8px',
    borderBottomLeftRadius: '0%',
    borderBottomRightRadius: '0%',
    height: '80%',
    width: '100%',
    display: 'block', // Removes bottom spacing (gap) under the image
    maxWidth: '100%', // Ensures image doesn't overflow parent's width
  },
  cardNoImg: {
    borderRadius: '8px',
    borderBottomLeftRadius: '0%',
    borderBottomRightRadius: '0%',
    height: '80%',
    width: '100%',
    display: 'block', // Removes bottom spacing (gap) under the image
    maxWidth: '100%', // Ensures image doesn't overflow parent's width
    color: '#ccc',
  },
  containerTitle: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  cardTitle: {
    color: '#360269',
    fontSize: 'calc(1vh + 2vw)',
    height: '100%',
  },
  cardTitleAlone: {
    height: 'max-content',
    color: '#360269',
    fontSize: 'calc(1.5vh + 3vw)',
    marginTop: '20%',
    marginBottom: '20%',
  },
});


const Card = ({ id, title, imageUrl }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const handleClick = () => {
    localStorage.setItem('electionId', id); 
    navigate(`/election/`);
  };
 

  return (
    <>
      {imageUrl ? (
        <Box className={classes.card} onClick={handleClick} style={{ cursor: 'pointer' }}>
          <img src={imageUrl} alt='' className={classes.cardImg}/>
          <Box className={classes.containerTitle}>
            <Typography variant="h3" sx={{ margin: 0, padding: 0 }}>{title}</Typography>
          </Box>
        </Box>
      ) : (
        <Box className={classes.card} onClick={handleClick} style={{ cursor: 'pointer' }}>
          <Typography variant="h3" sx={{ margin: 0, padding: 0 }}>{title}</Typography>
        </Box>
      )}
    </>
  );
};



export default Card;
