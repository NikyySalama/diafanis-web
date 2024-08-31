import React, { useState, useEffect } from 'react';
import { getTables, addTable } from '../../tables';
import Table from './Table';
import { Modal, Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import './UserTables.css'

const Tables = () => {
  const [tables, setTables] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tablesData, setTablesData] = useState([]);

  useEffect(() => {
    setTables(getTables());
  }, []);

  /*const handleListClicked = (title) => {
    setListClicked(title)
    openListModal();
  }*/
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
  };

  return (
    <div className='my-tables'>
      <h1 className='my-tables-title'>Sus Mesas</h1>
      <button className='add-table-button' onClick={handleCreateTableClick}>Crear Mesa</button>
      <div style={{padding: '10px'}}>
        <div className="table-data">
            <span className="table-id">Numero</span>
            <span className="table-location">Locacion</span>
        </div>
        <ul className='tables-container'>
          {tables.map((table, index) => (
            <li key={index}>
              <Table location={table.location} id={table.id}/>
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
