import React, { useState, useEffect } from 'react';
import { getElections, addElection } from '../elections';
import './UserElections.css'
import ElectionInList from './ElectionInList';
import ElectionRegistration from './ElectionRegistration';
import PositionRegistration from './PositionRegistration';
import PollingStationOrLists from './PollingStationOrLists'

const UserElections = () => {
  const [elections, setElections] = useState([]);
  const [isElectionRegistrationModalOpen, setIsElectionRegistrationModalOpen] = useState(false);
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [electionClicked, setElectionClicked] = useState("");


  useEffect(() => {
    setElections(getElections());
  }, []);

  const handleAddElection = (newElection) => {
    addElection(newElection);
    setElections(getElections());
  };

  const handleElectionContinue = () => {
    setIsElectionRegistrationModalOpen(false);
    setIsPositionModalOpen(true);
  };

  const handleElectionClicked = (title) => {
    setElectionClicked(title)
    setIsElectionModalOpen(true);
  }

  const openElectionRegistrationModal = () => setIsElectionRegistrationModalOpen(true);
  const closeElectionRegistrationModal = () => setIsElectionRegistrationModalOpen(false);
  const closePositionModal = () => setIsPositionModalOpen(false);
  const closeElectionModal = () => setIsElectionModalOpen(false);

  return (
    <div className='my-elections'>
      <h1 className='my-elections-title'>Sus Elecciones</h1>
      <button className='add-election-button' onClick={openElectionRegistrationModal}>Crear Eleccion</button>
      <div style={{padding: '10px'}}>
        <div className="election-data">
          <span className="election-name">Nombre</span>
          <span className="election-date">Fecha de Inicio</span>
          <span className="election-date">Fecha de Fin</span>
        </div>
        <ul className='election-list'>
          {elections.map((election, index) => (
            <li onClick={() => handleElectionClicked(election.name)} key={index}>
              <ElectionInList name={election.name} startDate={election.startDate} endDate={election.endDate}/>
            </li>
          ))}
        </ul>
      </div>

      {isElectionRegistrationModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className='modal-close-button' onClick={closeElectionRegistrationModal}>×</button>
            <ElectionRegistration onAddElection={handleAddElection} handleContinue={handleElectionContinue}/>
          </div>
        </div>
      )}

      {isPositionModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className='modal-close-button' onClick={closePositionModal}>×</button>
            <PositionRegistration onClose={closePositionModal}/>
          </div>
        </div>
      )}

      {isElectionModalOpen && (
        <div className="modal-overlay">
            <PollingStationOrLists election={electionClicked} onClose={closeElectionModal}/>
        </div>
      )}
    </div>
  );
};

export default UserElections;
