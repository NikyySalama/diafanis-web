import React from 'react';
import '../CSS/Grid.css';
import Card from './Card';
import { useState, useEffect } from 'react';
const GridCard = () => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        // Define an asynchronous function to fetch data
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/elections', {
                    method: 'GET', // Specify the method
                    headers: {
                        'Content-Type': 'application/json',
                        // Any other headers required for CORS
                    },
                    mode: 'cors', // Set mode to 'cors'
                });

                // Ensure the response is ok before converting to JSON
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
        <div className='electionsEmpty'>
          <h1 className='text-empty'>Lo sentimos, de momento no hay ninguna eleccion creada</h1>
        </div>
      );
    };

export default GridCard


