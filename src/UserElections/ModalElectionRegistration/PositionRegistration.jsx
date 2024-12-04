import React, { useState, useEffect } from 'react';
import './PositionRegistration.css';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';
import sanitizeInput from '../../Common/validatorInput';

const PositionRegistration = ({ onClose, electionId, initialPositions }) => {
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

  const handleAddPosition = async (position) => {
    const positionToSend = {
      title: sanitizeInput(position.title),
      description: '',
      electionUuid: electionId,
    };

    try {
      let response;
      if (position.uuid) {
        console.log("uuid: ", position.uuid);
        // Si la posición ya tiene un uuid, hacemos un PUT
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/electionPositions/${position.uuid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
          },
          body: JSON.stringify(positionToSend),
        });
      } else {
        // Si la posición no tiene uuid, hacemos un POST
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/electionPositions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
          },
          body: JSON.stringify(positionToSend),
        });
      }

      if (response.ok) {
        const savedPosition = await response.json();
      } else {
        console.error('Error al guardar la posición:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    positions.forEach((position) => handleAddPosition(position));
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