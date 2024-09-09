import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserElections.css'
import ElectionInList from './ElectionInList';
import ElectionModal from './ElectionModal';

const UserElections = () => {
  const [elections, setElections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try{
      const response = await fetch('http://localhost:8080/api/elections', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(response.ok) {
        const data = await response.json();
        const filteredElections = data.map(election => ({ //filtro los campos que necesito
          title: election.title,
          description: election.description,
          startsAt: election.startsAt,
          endsAt: election.endsAt,
          uuid: election.uuid
        }));
        setElections(filteredElections);
      } else{
        console.error('error al obtener las elecciones', response.statusText);
      }
    } catch(error){
        console.error('error en la solicitud de elecciones', error);
    }
  }
  
  const handleElectionClicked = (title, electionId) => {
    navigate('/userElections/election', { state: {title, electionId}});
  }

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className='my-elections'>
      <h1 className='my-elections-title'>Sus Elecciones</h1>
      <button className='add-election-button' onClick={openModal}>Crear Eleccion</button>
      <div style={{padding: '10px'}}>
        <div className="election-data">
          <span className="election-name">Nombre</span>
          <span className="election-date">Fecha de Inicio</span>
          <span className="election-date">Fecha de Fin</span>
        </div>
        <ul className='election-list'>
          {elections.map((election, index) => (
            <li onClick={() => handleElectionClicked(election.title, election.uuid)} key={index}>
              <ElectionInList title={election.title} startsAt={election.startsAt} endsAt={election.endsAt}/>
            </li>
          ))}
        </ul>
      </div>

      <ElectionModal
        show={isModalOpen}
        onClose={closeModal}
        onAddElection={fetchElections}
      />
    </div>
  );
};

export default UserElections;
