import React, { useState, useEffect } from 'react';
import { getLists } from '../../lists';
import { getPositions } from './positions';
import List from './List';
import { Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './UserLists.css';

const UserLists = () => {
  const [lists, setLists] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showPositionsModal, setShowPositionsModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id: ''
  });

  const [positionsData, setPositionsData] = useState([]);

  useEffect(() => {
    setLists(getLists());
    setPositions(getPositions());
  }, []);

  const handleCreateListClick = () => {
    setFormData({ id: '' });
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    handleClose();
    setShowPositionsModal(true);
  };

  const handleClosePositionsModal = () => setShowPositionsModal(false);
  
  const handleFileUpload = (e, positionId) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const updatedPositionsData = [...positionsData];
      updatedPositionsData[positionId] = data;
      setPositionsData(updatedPositionsData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handlePositionsSubmit = (e) => {
    e.preventDefault();
    console.log('Positions data submitted:', positionsData);
    handleClosePositionsModal();
  };

  return (
    <div className="user-lists">
      <h1 className="user-lists-title">Sus Formulas</h1>
      <button className="add-list-button" onClick={handleCreateListClick}>
        Crear Formula
      </button>
      <div className="lists-content">
        <div className="list-data">
          <span className="list-name">Nombre</span>
        </div>
        <ul className="lists-container">
          {lists.map((list, index) => (
            <li key={index}>
              <List name={list.name} />
            </li>
          ))}
        </ul>
      </div>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Lista Datos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="color">Color:</label>
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Ingrese color"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ingrese nombre"
                required
              />
            </div>
            <button type="submit" className="modal-button">
              Siguiente
            </button>
          </form>
        </Modal.Body>
      </Modal>
        
      <Modal show={showPositionsModal} onHide={handleClosePositionsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ingrese los Candidatos de Posiciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {positions.map((position, index) => (
            <div key={index} className="form-group">
              <h5>{position.title}</h5>
              <label>Subir archivo Excel para {position.title}:</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={(e) => handleFileUpload(e, index)}
                required
              />
            </div>
          ))}
          <button type="submit" className="modal-button" onClick={handlePositionsSubmit}>
            Guardar
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserLists;
