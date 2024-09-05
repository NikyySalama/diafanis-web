import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import Table from './Table';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './UserTables.css'
import { tab } from '@testing-library/user-event/dist/tab';

const Tables = () => {
  const electionId = useElection();
  const [tables, setTables] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tablesData, setTablesData] = useState([]);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch(`http://diafanis.com.ar/api/elections/${electionId}/tables`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTables(data);
      } else {
        console.error('error al obtener las mesas', response.statusText);
      }
    } catch (error) {
      console.error('error en la solicitud de partidos', error);
    }
  };

  const postTable = async (table) => {
    const location = {
      country : table.country,
      state : table.state,
      city : table.city,
      address : table.address
    }
    const tableToSend = {
        name : table.id,
        location : location
    }
    try {
      const response = await fetch(`http://diafanis.com.ar/api/elections/${electionId}/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tableToSend)
      });
      if (response.ok) {
        const savedTable = await response.json();
        console.log('Elección guardada:', savedTable);
      } else {
        console.error('Error al guardar la posicion:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleCreateTableClick = () => {
    setShowUploadModal(true);
  };

  const handleCloseUploadModal = () => setShowUploadModal(false);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      setTablesData(data);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleTablesSubmit = (e) => {
    e.preventDefault();
    console.log('Datos de las mesas cargados:', tablesData);
    handleCloseUploadModal();
    tablesData.forEach(tableData => postTable(tableData));
    fetchTables();
  };

  return (
    <div className='my-tables'>
      <h1 className='my-tables-title'>Sus Mesas</h1>
      <button className='add-table-button' onClick={handleCreateTableClick}>Crear Mesa</button>
      <div style={{padding: '10px'}}>
        <div className="table-data">
            <span className="table-id">Numero</span>
            <span className="table-location">Ciudad</span>
            <span className="table-location">Direccion</span>
        </div>
        <ul className='tables-container'>
          {tables.map((table, index) => (
            <li key={index}>
              <Table locationUuid={table.locationUuid} id={table.id}/>
            </li>
          ))}
        </ul>
      </div>

      <Modal show={showUploadModal} onHide={handleCloseUploadModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cargar Datos de Mesas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleTablesSubmit}>
            <div className="form-group">
              <label>Subir archivo Excel con Mesas:</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                required
              />
            </div>
            <button type="submit" className="modal-button">
              Guardar
            </button>
            <Button variant="secondary" onClick={handleCloseUploadModal}>
              Cancelar
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Tables;
