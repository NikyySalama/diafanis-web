import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const ItemMesa = ({ uuid,location }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    sessionStorage.setItem('tableUuid', uuid);
    navigate(`/election/table`);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        minWidth: '70%',
        height: '20%',
        maxHeight: '20%',
        display: 'flex',
        flexDirection: 'row',
        marginTop: 0,
        overflowY: 'auto',
        justifyContent: 'start',
        alignItems: 'center',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        border: '1px solid #ccc',
        paddingLeft: '2%',
        paddingRight: '2%',
        borderRadius: '16px',
        cursor: 'pointer',
        '&:hover': {
          border: '3px solid var(--primary-color)',
        },
      }}
    >
      <Typography color='var(--primary-color)' variant='h4' sx={{ marginRight: '1%',paddingRight:'0.25em' }}>
        Mesa
      </Typography>
      <Typography color='var(--primary-color)' variant='body2'>
        {location}
      </Typography>
    </Box>
  );
};

export default ItemMesa;