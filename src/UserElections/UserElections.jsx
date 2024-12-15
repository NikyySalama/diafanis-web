import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserElections.css';
import ElectionModal from './ModalElectionRegistration/ElectionModal';
import NavbarUserElection from './NavbarUserElection';
import CustomTable from './CustomTable';
import sanitizeInput from '../Common/validatorInput';
import ErrorLimitModal from './Election/ErrorLimitModal';

const UserElections = () => {
  const [elections, setElections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalErrorData, setErrorModalData] = useState({ isOpen: false, message: '', maxAllowed: null });
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('jwt'); // Example check
    if (!isLoggedIn) {
      navigate('/'); // Redirect to login if not authenticated
    }
  }, [navigate]); // Ensure that `navigate` is included in the dependency array
  sessionStorage.setItem('peeking an election', 'false');

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${sessionStorage.getItem('user')}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const filteredElections = data.elections.map((election) => ({
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
    sessionStorage.setItem('peeking an election', 'true');
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

  const handleAddPosition = async (position, electionUuid) => {
    const positionToSend = {
      title: sanitizeInput(position.title),
      description: '',
      electionUuid: electionUuid,
    };

    try {
      let response;
      if (position.uuid) {
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
        const responseBody = await response.json().catch(() => null);
        if (responseBody?.message === "El número total de posiciones excede el límite permitido.") {
          setErrorModalData({
            isOpen: true,
            message: responseBody.message,
            maxAllowed: responseBody.maxAllowed,
          });
        }
        throw new Error(`Error en la agregación de posición: ${response.status}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
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
        <CustomTable
          title="Elecciones"
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
          handleAddPosition={handleAddPosition}
        />

        <ErrorLimitModal
          isOpen={modalErrorData.isOpen}
          message={modalErrorData.message}
          maxAllowed={modalErrorData.maxAllowed}
          onClose={() => setErrorModalData({ ...modalErrorData, isOpen: false })}
        />
      </div>
    </div>
  );
};

export default UserElections;