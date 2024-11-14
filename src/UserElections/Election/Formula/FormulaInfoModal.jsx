import React from 'react';
import { Modal } from 'react-bootstrap';

const FormulaInfoModal = ({ show, onHide, handleEdit, editFormulaData, parties }) => {

    const selectedParty = parties.find(party => party.uuid === editFormulaData.partyUuid);
    const partyName = selectedParty ? selectedParty.name : 'Nombre no encontrado';
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Información de Fórmula</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p><strong>Id:</strong> {editFormulaData.idNumber}</p>
                    <p><strong>Partido:</strong> {partyName}</p>
                </div>
                <div>
                    <p><strong>Candidatos</strong></p>
                    {editFormulaData.candidates.map((candidate, index) => (
                        <div key={index} className="candidate-info">
                            <p><strong>Nombre y Apellido:</strong> {candidate.data?.name || 'Nombre no disponible'} {candidate.data?.lastName || 'Apellido no disponible'}</p>
                            <p><strong>Document Number:</strong> {candidate.data?.docNumber || 'Document Number no disponible'}</p>
                            <p><strong>Rol:</strong> {candidate.role || 'Rol no disponible'}</p>
                        </div>
                    ))}
                </div>
                <button type="button" className="modal-button" onClick={handleEdit}>
                    Editar
                </button>
            </Modal.Body>
        </Modal>
    );
};

export default FormulaInfoModal;