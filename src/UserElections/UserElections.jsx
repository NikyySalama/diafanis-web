import React, { useState, useEffect } from 'react';
import electionsData from '../elections';
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
    <div className='my-elections'>
      <h1 className='my-elections-title'>Sus Elecciones</h1>
      <button className='add-election-button' onClick={addElection}>Crear Eleccion</button>
      <div style={{padding: '10px'}}>
        <div className="election-data">
          <span className="election-name">Nombre</span>
          <span className="election-date">Fecha de Inicio</span>
          <span className="election-date">Fecha de Fin</span>
        </div>
        <ul className='election-list'>
          {elections.map((election, index) => (
            <li key={index}>
              <ElectionInList name={election.name} startDate={election.startDate} endDate={election.endDate}/>
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
