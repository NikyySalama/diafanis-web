import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserElections.css';
import ElectionModal from './ModalElectionRegistration/ElectionModal';
import NavbarUserElection from './NavbarUserElection';
import CustomTable from './CustomTable';

const UserElections = () => {
  const [elections, setElections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/elections', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filteredElections = data.map((election) => ({
          title: election.title,
          description: election.description,
          startsAt: election.startsAt,
          endsAt: election.endsAt,
          uuid: election.uuid,
        }));
        setElections(filteredElections);
      } else {
        console.error('Error al obtener las elecciones', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud de elecciones', error);
    }
  };

  const handleElectionClicked = (title, electionId) => {
    navigate('/userElections/election', { state: { title, electionId } });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const columns = [
    { field: 'title', label: 'Nombre' },
    { field: 'startsAt', label: 'Fecha de Inicio', align: 'right' },
    { field: 'endsAt', label: 'Fecha de Fin', align: 'right' },
  ];

  return (
    <div>
      <NavbarUserElection />
      <div className="my-elections">
      <div className="my-elections-header">
        {/*<h1 className="my-elections-title">Sus Elecciones</h1>
        <button className="add-election-button" onClick={openModal}>
          Crear Elección
        </button>*/}
      </div>

        <CustomTable
          title="Sus Elecciones"
          columns={columns}
          rows={elections}
          onRowClick={(row) => handleElectionClicked(row.title, row.uuid)}
          handleAddSelected={openModal}
        />

        <ElectionModal
          show={isModalOpen}
          onClose={closeModal}
          onAddElection={fetchElections}
        />
      </div>
    </div>
  );
};

export default UserElections;