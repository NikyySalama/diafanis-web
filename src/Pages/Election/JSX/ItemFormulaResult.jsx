import React from "react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const ItemFormulaResult = ({ imgUrl, votes }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: '4%',
      }}
    >
      <Box
        component="img"
        sx={{
          maxWidth: '20%',
          height: 'fit-content',
          marginRight: '5%',
        }}
        src={imgUrl}
        alt="Party Logo"
      />
      <Typography color='var(--primary-color)' variant="h5">
        {votes}
      </Typography>
    </Box>
  );
};

export default ItemFormulaResult;