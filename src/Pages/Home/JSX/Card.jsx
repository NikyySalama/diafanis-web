import React from 'react';
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
    <Box
      onClick={handleClick}
      sx={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        minHeight: imageUrl ? '30%' : '100%',
        backgroundColor: 'var(--background-color)',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minWidth: 'fit-content',
        marginBottom: imageUrl ? '0' : '35%',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.05)',
        },
      }}
    >
      {imageUrl ? (
        <Box
          component="img"
          src={imageUrl}
          alt=""
          sx={{
            borderRadius: '8px',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            height: '80%',
            width: '100%',
            display: 'block',
            maxWidth: '100%',
          }}
        />
      ) : null}
      <Box
        sx={{
          height: '20%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ margin: 0, padding: 0 }}>
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default Card;