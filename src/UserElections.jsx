import React, { useState, useEffect } from 'react';
import electionsData from './elections';
import './UserElections.css'
import ElectionInList from './ElectionInList';
import ElectionRegistration from './ElectionRegistration';

const UserElections = () => {
  const [elections, setElections] = useState([]);
  const [isModalRegistrationOpen, setIsModalRegistrationOpen] = useState(false); // Estado para controlar la visibilidad del modal


  useEffect(() => {
    setElections(electionsData);
  }, []);

  const addElection = () => {
    setIsModalRegistrationOpen(true);
  };

  const closeModal = () => {
    setIsModalRegistrationOpen(false);
  }

  return (
    <div>
      <h1 className='my-elections-title'>Sus Elecciones</h1>
      <button className='add-election-button' onClick={addElection}>Crear Eleccion</button>
      <ul className='election-list'>
        {elections.map((election, index) => (
          <li key={index}>
            {election.name}
            </li>
          ))}
        </ul>
      </div>

      {isModalRegistrationOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className='modal-close-button' onClick={closeModal}>×</button>
            <ElectionRegistration />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserElections;
