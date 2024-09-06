import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import ElectionRegistration from './ElectionRegistration';
import PositionRegistration from './PositionRegistration';

const ElectionModal = ({ show, onClose, onAddElection }) => {
  const [modalContent, setModalContent] = useState('election');
  const [addedElection, setAddedElection] = useState(null);

  const handleContinue = () => setModalContent('position');

  const handleClose = () => {
    onClose();
    setModalContent('election');
    setAddedElection(null);
  }

  const handleAddElection = async (newElection) => {
    const electionData = {
        title: newElection.title,
        description: newElection.description,
        startsAt: newElection.startsAt,
        endsAt: newElection.endsAt,
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

        setAddedElection(savedElection);
        if (addedElection) {
          console.log("uuid elec:", addedElection.uuid);
        }
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
            <ElectionRegistration handleAddElection={handleAddElection} handleContinue={handleContinue} />
        ) : (
            addedElection ? (
                <PositionRegistration onClose={handleClose} electionId={addedElection.uuid} />
            ) : (
                <p>Cargando...</p>
            )
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ElectionModal;
