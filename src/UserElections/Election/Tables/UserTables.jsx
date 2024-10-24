import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import CustomTable from '../../CustomTable';
import { Modal } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import '../ElectionSection.css';
import sanitizeInput from '../../../Common/validatorInput';
import checkIMGByURL from '../../../Common/validatorURL';
const Tables = () => {
  const { electionId, electionEditable } = useElection();
  const [tables, setTables] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadTableModal, setShowUploadTableModal] = useState(false);
  const [showViewTableModal, setShowViewTableModal] = useState(false); // Estado para mostrar la vista sin editar
  const [tablesData, setTablesData] = useState([]);
  const [isFileValid, setIsFileValid] = useState(false);
  const [tableData, setTableData] = useState({
    country: '', 
    state: '',
    city: '',
    address: '',
    uuid: '',
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}/tables`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTables(data); // Guardamos las mesas tal como llegan
      } else {
        console.error('Error al obtener las mesas', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud de mesas', error);
    }
  };

  const postTable = async (table) => {
    const location = {
      country: table.country,
      state: table.state,
      city: table.city,
      address: table.address
    };
    const tableToSend = {
      name: table.id,
      electionUuid: electionId,
      location: location
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
        },
        body: JSON.stringify(tableToSend)
      });
      if (response.ok) {
        const savedTable = await response.json();
        console.log('Mesa guardada:', savedTable);
        fetchTables();
      } else {
        console.error('Error al guardar la mesa:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleCreateTableClick = () => {
    setShowUploadModal(true);
  };

  const handleTableClick = (row) => {
    const clickedTable = tables.find(table => table.location.address === row.address);
    if (clickedTable) {
      setTableData({
        country: clickedTable.location.country, 
        state: clickedTable.location.state,
        city: clickedTable.location.city,
        address: clickedTable.location.address,
        uuid: clickedTable.uuid,
      });
      setShowViewTableModal(true); // Mostrar modal para visualizar la mesa
    }
  };

  const handleCloseUploadModal = () => {
    setShowUploadModal(false);
    setIsFileValid(false);
  };

  const handleCloseViewTableModal = () => {
    setShowViewTableModal(false);
  };

  const handleCloseEditTableModal = () => {
    setShowUploadTableModal(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const validExtensions = ['.xls', '.xlsx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!validExtensions.includes(`.${fileExtension}`)) {
        alert('Por favor suba un archivo Excel válido (.xls o .xlsx).');
        return;
    }
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
      const requiredColumns = ['country', 'state', 'city', 'address'];
      const fileColumns = data[0]; 
  
      const isValid = requiredColumns.every(col => fileColumns.includes(col));
  
      if (!isValid) {
        alert('El archivo Excel no tiene la estructura correcta. Asegúrate de que contenga las columnas: id, country, state, city, address.');
        setIsFileValid(false);
        e.target.value = '';
        return;
      }
      const sanitizedTablesData = XLSX.utils.sheet_to_json(sheet).map(row => ({
        id: sanitizeInput(row.id),
        country: sanitizeInput(row.country),
        state: sanitizeInput(row.state),
        city: sanitizeInput(row.city),
        address: sanitizeInput(row.address),
    }));
      setTablesData(sanitizedTablesData);
      setIsFileValid(true);
    };
  
    reader.readAsArrayBuffer(file);
  };

  const handleUpdateTable = async () => {
    const { country, state, city, address, uuid } = tableData;
    const location = {
      country, state, city, address,
    };

    const tableToSend = {
      location,
    };

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tables/${uuid}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
            },
            body: JSON.stringify(tableToSend)
        });

        if (response.ok) {
            const savedTable = await response.json();
            fetchTables(); 
        } else {
            console.error('Error al actualizar la mesa:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
    setShowUploadTableModal(false);
  };

  const handleTablesSubmit = (e) => {
    e.preventDefault();
    handleCloseUploadModal();
    tablesData.forEach(tableData => postTable(tableData));
    fetchTables();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTableData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditTableClick = () => {
    if(electionEditable){
      setShowViewTableModal(false);
      setShowUploadTableModal(true); // Abrir el modal de edición
    }
    else
      alert('La eleccion ya no es editable.');
  };

  const handleDeleteTables = async (tables) => {
    if(!electionEditable){
      alert('La eleccion ya no es editable.');
      return;
    }
    
    try {
      await Promise.all(
        tables.map(async (table) => {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tables/${table}`, {
            method: 'DELETE',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
            },
          });
  
          if (!response.ok) {
            throw new Error(`Error en la respuesta del servidor: ${response.status}`);
          }
        })
      );
      fetchTables();
    } catch (error) {
      console.error('Error al eliminar mesas', error);
    }
  };

  const columns = [
    { label: 'Numero', field: 'id', align: 'left' },
    { label: 'Ciudad', field: 'city', align: 'left' },
    { label: 'Direccion', field: 'address', align: 'left' },
  ];

  const rows = tables.map((table, index) => ({
    uuid: table.uuid,
    id: index + 1,
    city: table.location.city,
    address: table.location.address,
  }));

  return (
    <div className='my-section'>
      <div className="my-section-header">
        {/*<h2 className='my-section-title'>Sus Mesas</h2>
        <button className='add-section-button' onClick={handleCreateTableClick}>Crear Mesa</button>*/}
      </div>

      <CustomTable 
        title="Sus Mesas" 
        columns={columns} 
        rows={rows} 
        onRowClick={handleTableClick} 
        handleAddSelected={handleCreateTableClick}
        handleDeleteSelected={handleDeleteTables}
      />

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
            <button type="submit" className="modal-button" disabled={!isFileValid}>
              Guardar
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showViewTableModal} onHide={handleCloseViewTableModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ver Mesa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p><strong>País:</strong> {tableData.country}</p>
            <p><strong>Estado:</strong> {tableData.state}</p>
            <p><strong>Ciudad:</strong> {tableData.city}</p>
            <p><strong>Dirección:</strong> {tableData.address}</p>
          </div>
          <button type="button" className="modal-button" onClick={handleEditTableClick}>
            Editar
          </button>
        </Modal.Body>
      </Modal>

      {/* Modal para editar mesa seleccionada */}
      <Modal show={showUploadTableModal} onHide={handleCloseEditTableModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Mesa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="country">País:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={tableData.country}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">Estado:</label>
            <input
              type="text"
              id="state"
              name="state"
              value={tableData.state}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="city">Ciudad:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={tableData.city}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Dirección:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={tableData.address}
              onChange={handleInputChange}
            />
          </div>
          <button className="modal-button" onClick={handleUpdateTable}>
            Guardar cambios
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Tables;