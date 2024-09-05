import React, { useState } from 'react';
import './PositionRegistration.css'

const PositionRegistration = ({onClose, electionId}) => {
  const [positions, setPositions] = useState([{ title: '' }]);

  const handlePositionChange = (index, event) => {
    const newPositions = [...positions];
    newPositions[index].title = event.target.value;
    setPositions(newPositions);
  };

  const addPosition = () => {
    setPositions([...positions, { title: '' }]);
  };

  const handleAddPosition = async (position) => {
    const positionToSend = {
        title: position.title,
        description: ''
    };
    try {
      const response = await fetch(`http://diafanis.com.ar/api/electionPositions/${electionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(positionToSend)
      });

      if (response.ok) {
        const savedPosition = await response.json();
        console.log('Elección guardada:', savedPosition);
      } else {
        console.error('Error al guardar la posicion:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Positions registered:', positions);
    positions.forEach(position => handleAddPosition(position));
    onClose();
  };

  return (
    <div className="position-registration">
      <p>Título de la Posición:</p>
      <form onSubmit={handleSubmit}>
        {positions.map((position, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <input className='input-position'
              placeholder='Posición'
              type="text"
              value={position.title}
              onChange={(event) => handlePositionChange(index, event)}
              required
            />
          </div>
        ))}
        <button className='add-position-button' type="button" onClick={addPosition}>
          + Nueva Posición
        </button>
        <button className='register-button' type="submit">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default PositionRegistration;
