import React from 'react';
import { Modal } from 'react-bootstrap';

const CreateListModal = ({ show, onHide, setEditFormulaData, handleSubmit, editFormulaData, parties }) => (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Fórmula</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="id">ID de fórmula:</label>
              <input
                type="text"
                id="id"
                name="idNumber"
                value={editFormulaData.idNumber}
                onChange={(e) => setEditFormulaData({ ...editFormulaData, idNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="partyUuid">Partido:</label>
              <select
                id="partyUuid"
                name="partyUuid"
                value={editFormulaData.partyUuid}
                onChange={(e) => setEditFormulaData({ ...editFormulaData, partyUuid: e.target.value })}
                required
              >
                <option value="">Seleccionar Partido</option>
                {parties.map((party) => (
                  <option key={party.uuid} value={party.uuid}>
                    {party.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Guardar Cambios</button>
          </form>
        </Modal.Body>
      </Modal>
);

export default CreateListModal;