import React, { useState, useEffect } from 'react';
import { getElections, addElection } from '../elections';
import './UserElections.css'
import ElectionInList from './ElectionInList';
import ElectionRegistration from './ElectionRegistration';
import PositionRegistration from './PositionRegistration';

const UserElections = () => {
  const [elections, setElections] = useState([]);
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);

  useEffect(() => {
    setElections(getElections());
  }, []);

  const handleAddElection = (newElection) => {
    addElection(newElection);
    setElections(getElections());
  };

  const handleElectionContinue = () => {
    setIsElectionModalOpen(false);
    setIsPositionModalOpen(true);
  };

  const openElectionModal = () => setIsElectionModalOpen(true);
  const closeElectionModal = () => setIsElectionModalOpen(false);
  const closePositionModal = () => setIsPositionModalOpen(false);

  return (
    <div className='my-elections'>
      <h1 className='my-elections-title'>Sus Elecciones</h1>
      <button className='add-election-button' onClick={openElectionModal}>Crear Eleccion</button>
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

      {isElectionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className='modal-close-button' onClick={closeElectionModal}>×</button>
            <ElectionRegistration onAddElection={handleAddElection} handleContinue={handleElectionContinue}/>
          </div>
        </div>
      )}

      {isPositionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className='modal-close-button' onClick={closePositionModal}>×</button>
            <PositionRegistration handleRegistrationEnd={closePositionModal}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserElections;
