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
    const isLoggedIn = sessionStorage.getItem('jwt'); // Example check
    if (!isLoggedIn) {
      navigate('/'); // Redirect to login if not authenticated
    }
  }, [navigate]); // Ensure that `navigate` is included in the dependency array


  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections`, {
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

  const handleElectionClicked = (title, electionId, startsAt) => {
    // Sumar 1 día a startsAt
    const oneDayBefore = new Date(new Date(startsAt).getTime() - 24 * 60 * 60 * 1000);

    // Comparar la fecha actual con startsAt + 1 día
    const electionEditable = new Date() < oneDayBefore;
    navigate('/userElections/election', { state: { title, electionId, electionEditable } });
  };

  const handleDeleteElections = async (elections) => {
    try {
      await Promise.all(
        elections.map(async (election) => {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${election}`, {
            method: 'DELETE',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
             },
          });
  
          if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
          }
        })
      );
      fetchElections();
    } catch (error) {
      console.error('Error al eliminar elecciones', error);
    }
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
          onRowClick={(row) => handleElectionClicked(row.title, row.uuid, row.startsAt)}
          handleAddSelected={openModal}
          handleDeleteSelected={handleDeleteElections}
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