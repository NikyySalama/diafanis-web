import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import List from './List';
import { Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './UserLists.css';

const UserLists = () => {
  const electionId = useElection();
  const [lists, setLists] = useState([]);
  const [positions, setPositions] = useState([]);
  const [showPositionsModal, setShowPositionsModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    partyId: '',
    id: ''
  });

  const [positionsData, setPositionsData] = useState([]);
  const [parties, setParties] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLists = await fetchParties();
      const fetchedPositions = await getPositions();
      const fetchedParties = await fetchParties();
  
      setLists(fetchedLists);
      setPositions(fetchedPositions);
      setParties(fetchedParties);
    };
  
    fetchData();
  }, []);

  const getPositions = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/elections/${electionId}/electionPositions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error al obtener los posiciones');
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  const fetchParties = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/elections/${electionId}/parties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Error al obtener los partidos');
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const handleCreateListClick = () => {
    setFormData({ partyId: '', id: '' });
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
              <label htmlFor="id">ID de formula:</label>
              <input
                type="text"
                id="id"
                name="id"
                value={formData.id}
                onChange={handleChange}
                placeholder="Ingrese ID de formula"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="partyId">Elegir partido:</label>
              <select
                id="partyId"
                name="partyId"
                value={formData.partyId}
                onChange={handleChange}
                required
              >
              <option value="">Seleccione un partido</option>
              {parties.map((party) => (
                <option key={party.id} value={party.id}>
                  {party.name}
                </option>
              ))}
              </select>
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
