import React from 'react';
import '../CSS/SubTitle.css';
import Typography from '@mui/material/Typography';

const SubTitle = ({ searchTerm, setSearchTerm }) => {
  return (
    <div 
      className="subTitle" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 2vw',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      <Typography 
        sx={{ 
          margin: '0', 
          marginLeft: '2vw', 
          marginRight: '2vw',
          whiteSpace: 'nowrap',
          color: 'var(--primary-color)', 
          fontSize: '1.7em'
        }} 
        variant="body1"
      >
        Elecciones activas
      </Typography>

      <input 
        type="text" 
        placeholder="Buscar elecciones..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
        style={{ 
          padding: '0.5em', 
          fontSize: '1em', 
          width: '25rem',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
};

export default SubTitle;