import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ElectionRegistration from './ElectionRegistration';
import PositionRegistration from './PositionRegistration';

const ElectionModal = ({ show, onClose, onAddElection, handleAddPosition, initialData }) => {
  const [modalContent, setModalContent] = useState('election');
  const [addedElection, setAddedElection] = useState(null);

  const handleContinue = () => setModalContent('position');

  const handleClose = () => {
    onClose();
    setModalContent('election');
    setAddedElection(null);
  };

  const handleAddElection = async (newElection) => {
    try {
      const method = initialData ? 'PATCH' : 'POST';
      const url = initialData
        ? `${process.env.REACT_APP_API_URL}/api/elections/${initialData.uuid}`
        : `${process.env.REACT_APP_API_URL}/api/elections`;
     
      
      console.log("initialData", initialData);

      if(initialData){
        delete newElection.planLimit;
        sessionStorage.setItem('updatingElection', 'true');
      }
      else{
        sessionStorage.setItem('updatingElection', 'false');
      }
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
        },
        body: JSON.stringify(newElection),        
      });

      console.log("new election: ", newElection);
      
      if (response.ok) {
        const savedElection = await response.json();
        onAddElection(); // Actualizar la lista de elecciones
        setAddedElection(savedElection);
      } else {
        const responseBody = await response.json().catch(() => null);
        console.error('Error al guardar la elección:', {
          status: response.status,
          statusText: response.statusText,
          errorBody: responseBody,
        });
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleAddPositionHere = async (position) => {
    if (addedElection) {
      await handleAddPosition(position, addedElection.uuid);
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {modalContent === 'election' ? 'Registrar Elección' : 'Registro de Posición'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalContent === 'election' ? (
          <ElectionRegistration
            handleAddElection={handleAddElection}
            handleContinue={handleContinue}
            initialData={initialData}
          />
        ) : (
          addedElection ? (
            <PositionRegistration 
              onClose={handleClose}
              initialPositions={initialData?.positions || []}  // Asegúrate de que no falle si es undefined
              handleAddPosition={handleAddPositionHere}
              />
          ) : (
            <p>Cargando...</p>
          )
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ElectionModal;