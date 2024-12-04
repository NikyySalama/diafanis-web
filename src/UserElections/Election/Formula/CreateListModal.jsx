import React from 'react';
import { Modal } from 'react-bootstrap';

const CreateListModal = ({ show, onHide, formData, handleChange, handleSubmit, parties }) => (
  <Modal show={show} onHide={onHide} centered>
    <Modal.Header closeButton>
      <Modal.Title>Datos de la Lista</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={handleSubmit}>
        {/* ID de Fórmula */}
        <div className="mb-3">
          <label htmlFor="id" className="form-label">ID de fórmula:</label>
          <input
            type="text"
            id="id"
            name="id"
            className="form-control"
            value={formData.id}
            onChange={handleChange}
            placeholder="Ingrese ID de fórmula"
            required
          />
        </div>

        {/* Selector de Partido */}
        <div className="mb-3">
          <label htmlFor="partyUuid" className="form-label">Partido:</label>
          <select
            id="partyUuid"
            name="partyUuid"
            className="form-select"
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

        {/* Botón de enviar */}
        <button type="submit" className="btn btn-primary w-100">Crear Lista</button>
      </form>
    </Modal.Body>
  </Modal>
);

export default CreateListModal;