import React from 'react';
import { Modal } from 'react-bootstrap';

const CreateListModal = ({ show, onHide, formData, handleChange, handleSubmit, parties }) => (
    <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Datos de la Lista</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">ID de fórmula:</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            placeholder="Ingrese ID de fórmula"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="partyUuid">Partido:</label>
          <select
            id="partyUuid"
            name="partyUuid"
            value={formData.partyUuid}
            onChange={handleChange}
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
        <button type="submit" className="btn btn-primary">Crear Lista</button>
      </form>
    </Modal.Body>
  </Modal>
);

export default CreateListModal;