import React from 'react';
import { Modal } from 'react-bootstrap';

const CreateListModal = ({ show, onHide, handleFileUpload, handleSubmit, positions }) => (
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Posiciones y Candidatos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {positions.map((position, index) => (
              <div key={position.uuid} className="form-group">
                <label htmlFor={`position${index}`}>{position.title}</label>
                <input
                  type="file"
                  id={`position${index}`}
                  name={`position${index}`}
                  accept=".xlsx, .xls"
                  onChange={(e) => handleFileUpload(e, index)}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn btn-primary">Subir Fórmulas</button>
          </form>
        </Modal.Body>
    </Modal>
);

export default CreateListModal;