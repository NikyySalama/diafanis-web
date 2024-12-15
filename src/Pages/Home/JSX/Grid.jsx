import React, { useState, useEffect } from 'react';
import '../CSS/Grid.css';
import Card from './Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const GridCard = ({ searchTerm }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCards(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Elimina diacríticos
  };

  const filteredCards = cards.filter(card => 
    removeAccents(card.title.toLowerCase()).includes(removeAccents(searchTerm.toLowerCase()))
  );

  sessionStorage.setItem('electionInProgress', 'false');

  return filteredCards && filteredCards.length > 0 ? (
    <div className='grid-container'>
      <div className='grid'>
        {filteredCards.map((card, index) => (
          <Card key={index} title={card.title} imageUrl={card.imageUrl || ""} id={card.uuid} />
        ))}
      </div>
    </div>
  ) : (
    <Box sx={{
      height: '25em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Typography color='var(--primary-color)' align='center' variant="h3">
        {searchTerm ? `No se encontraron elecciones para "${searchTerm}"` : {loading} ? 'Cargando...' : 'No hay elecciones disponibles'}
      </Typography>
    </Box>
  );
};

export default GridCard;
