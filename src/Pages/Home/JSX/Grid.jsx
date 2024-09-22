import React, { useState, useEffect } from 'react';
import '../CSS/Grid.css';
import Card from './Card';

const GridCard = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/elections', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCards(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return cards.length > 0 ? (
    <div className="grid-container">
      <div className="grid">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} imageUrl={card.imageUrl || ''} id={card.uuid} />
        ))}
      </div>
    </div>
  ) : (
    <div className="elections-empty">
      <h1 className="text-empty">Lo sentimos, de momento no hay ninguna elección creada</h1>
    </div>
  );
};

export default GridCard;