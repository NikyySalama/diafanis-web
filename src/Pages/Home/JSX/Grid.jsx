import React, { useState, useEffect } from 'react';
import '../CSS/Grid.css';
import Card from './Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const GridCard = () => {
  const [cards, setCards] = useState([]);

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

                const data = await response.json(); // Convert the response to JSON
                setCards(data); // Set the fetched data to the state
            } catch (error) {
                console.error('Error fetching data:', error); // Handle any errors
            }
        };

        fetchData(); // Call the asynchronous fetch function
    }, []); 

    const addCard= (newCard) => {
        setCards([...cards,newCard]);
    }    

   
    return cards && cards.length > 0 ? (
        <div className='grid-container'>
          <div className='grid'>
            {cards.map((card, index) => (
              <Card key={index} title={card.title} imageUrl={card.imageUrl || ""} id={card.uuid} />
            ))}
          </div>
        </div>
      ) : (
        <Box   sx={{
          height: '60em',
          display: 'flex',
          flexDirection: 'column', 
          alignItems: 'center',    
          justifyContent: 'center' 
        }} >
           <Typography color='var(--primary-color)' align='center' variant="h3">Lo sentimos, de momento no hay ninguna eleccion creada</Typography>
        </Box>
      )
};

export default GridCard;