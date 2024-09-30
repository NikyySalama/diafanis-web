import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ElectionRegistration from './ElectionRegistration';
import PositionRegistration from './PositionRegistration';

const ElectionModal = ({ show, onClose, onAddElection, initialData }) => {
  const [modalContent, setModalContent] = useState('election');
  const [addedElection, setAddedElection] = useState(null);

  const handleContinue = () => setModalContent('position');

  const handleClose = () => {
    onClose();
    setModalContent('election');
    setAddedElection(null);
  };

  console.log("data", initialData);

  const handleAddElection = async (newElection) => {
    try {
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData
        ? `http://localhost:8080/api/elections/${initialData.uuid}`
        : 'http://localhost:8080/api/elections';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newElection)
      });

      if (response.ok) {
        const savedElection = await response.json();
        console.log('Elección guardada:', savedElection);
        onAddElection(); // Actualizar la lista de elecciones
        setAddedElection(savedElection);
      } else {
        console.error('Error al guardar la elección:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
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
              electionId={addedElection.uuid} 
              initialPositions={initialData?.positions || []}  // Asegúrate de que no falle si es undefined
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