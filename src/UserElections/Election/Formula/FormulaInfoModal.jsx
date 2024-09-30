import React from 'react';
import { Modal } from 'react-bootstrap';

const FormulaInfoModal = ({ show, onHide, handleEdit, editFormulaData, parties }) => {
    
    const selectedParty = parties.find(party => party.uuid === editFormulaData.partyUuid);
    const partyName = selectedParty ? selectedParty.name : 'Nombre no encontrado';
    
    
    return(
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Información de Fórmula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div>
            <p><strong>Id:</strong> {editFormulaData.idNumber}</p>
            <p><strong>Partido:</strong> {partyName}</p>
        </div>
        <button type="button" className="modal-button" onClick={handleEdit}>
            Editar
        </button>
        </Modal.Body>
    </Modal> 
    );   
};

export default FormulaInfoModal;