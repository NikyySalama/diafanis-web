import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ElectionRegistration from './ElectionRegistration';
import PositionRegistration from './PositionRegistration';

const ElectionModal = ({ show, onClose, onAddElection }) => {
  const [modalContent, setModalContent] = useState('election');
  const [positions, setPositions] = useState([]);


  const handleContinue = () => setModalContent('position');

  const handleAddPositions = (newPositions) => {
    setPositions(newPositions);
  };

  const handleClose = () => {
    onClose();
    setModalContent('election');
  }

  const handleAddElection = async (newElection) => {
    const electionData = {
        title: newElection.title,
        description: newElection.description,
        startsAt: newElection.startsAt,
        endsAt: newElection.endsAt,
        positions: positions,
        image: "base 64"
    };
    try {
      const response = await fetch('http://diafanis.com.ar/api/elections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(electionData)
      });

      if (response.ok) {
        const savedElection = await response.json();
        console.log('Elección guardada:', savedElection);
        onAddElection(); 
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
          <ElectionRegistration onAddElection={handleAddElection} handleContinue={handleContinue} />
        ) : (
          <PositionRegistration onClose={handleClose} handleAddPositions={handleAddPositions} />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ElectionModal;
