import React, { useState, useEffect } from 'react';
import './PositionRegistration.css';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';

const PositionRegistration = ({ onClose, initialPositions, handleAddPosition }) => {
  const [positions, setPositions] = useState([{ title: '', uuid: null }]);
  const [lastRemoved, setLastRemoved] = useState(null); // Para el undo

  // Cuando initialData esté disponible, pre-rellena los campos del formulario
  useEffect(() => {
    if (initialPositions && initialPositions.length > 0) {
      setPositions(initialPositions.map((position) => ({
        title: position.title,
        uuid: position.uuid, // Agrega el identificador
      })));
    } else {
      setPositions([{ title: '', uuid: null }]); // Restablece a la posición inicial si no hay datos
    }
  }, [initialPositions]);

  const handlePositionChange = (index, event) => {
    const newPositions = [...positions];
    newPositions[index].title = event.target.value;
    setPositions(newPositions);
  };

  const addPosition = () => {
    setPositions([...positions, { title: '', uuid: null }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    positions?.forEach((position) => handleAddPosition(position));
    sessionStorage.setItem('electionInProgress', 'false');
    onClose();
  };

  const handleRemovePosition = (index) => {
    const updatedPositions = [...positions];
    const removedPosition = updatedPositions.splice(index, 1)[0]; // Guarda la posición eliminada
    setPositions(updatedPositions);
    setLastRemoved(removedPosition);

    setTimeout(() => {
      setLastRemoved(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (lastRemoved) {
      setPositions([...positions, lastRemoved]); // Reagrega la última posición eliminada
      setLastRemoved(null);
    }
  };

  return (
    <div className="position-registration">
      <p>Título de la Posición:</p>
      <form onSubmit={handleSubmit}>
        {positions.map((position, index) => (
          <div key={index} style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <input
              className='input-position'
              placeholder='Posición'
              type="text"
              value={position.title}
              onChange={(event) => handlePositionChange(index, event)}
              required
            />
            <DeleteIcon
              style={{ cursor: 'pointer', marginLeft: '10px' }}
              onClick={() => handleRemovePosition(index)}
            />
          </div>
        ))}

        <div className='buttons'>
          <button className='add-position-button' type="button" onClick={addPosition}>
            + Nueva Posición
          </button>
          <button className='register-button' type="submit">
            Registrar
          </button>
        </div>

        {lastRemoved && (
          <button className='undo-button' type="button" onClick={handleUndo}>
            <ReplayIcon style={{marginRight: '5px'}}/>
            Undo Last Delete
          </button>
        )}
      </form>
    </div>
  );
};

export default PositionRegistration;