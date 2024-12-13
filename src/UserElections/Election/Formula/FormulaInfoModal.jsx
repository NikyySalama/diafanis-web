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
                {/* Sección general */}
                <div className="mb-3">
                    <p className="mb-1"><strong>Id:</strong> {editFormulaData.idNumber}</p>
                    <p><strong>Partido:</strong> {partyName}</p>
                </div>

                {/* Sección de candidatos */}
                <div className="candidate-section">
                    <h6 className="mb-2">Candidatos</h6>
                    {editFormulaData.candidates.map((candidate, index) => (
                        <div
                            key={index}
                            className="p-3 mb-3 border rounded shadow-sm bg-light"
                        >
                            <p className="mb-1">
                                <strong>Nombre y Apellido:</strong> {candidate.data?.name || 'Nombre no disponible'} {candidate.data?.lastName || 'Apellido no disponible'}
                            </p>
                            <p className="mb-1">
                                <strong>Número de documento:</strong> {candidate.data?.docNumber || 'Document Number no disponible'}
                            </p>
                            <p className="mb-0">
                                <strong>Rol:</strong> {candidate.role || 'Rol no disponible'}
                            </p>
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