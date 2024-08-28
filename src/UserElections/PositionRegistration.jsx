import React, { useState } from 'react';
import './PositionRegistration.css'

const PositionRegistration = ({onClose}) => {
  const [positions, setPositions] = useState([{ title: '' }]);

  const handlePositionChange = (index, event) => {
    const newPositions = [...positions];
    newPositions[index].title = event.target.value;
    setPositions(newPositions);
  };

  const addPosition = () => {
    setPositions([...positions, { title: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Positions registered:', positions);
  };

  return (
    <div className="position-registration">
      <h1>Registro de Posición</h1>
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
        <button className='register-button' onClick={onClose} type="submit">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default PositionRegistration;
