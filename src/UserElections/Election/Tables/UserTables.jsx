import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import CustomTable from '../../CustomTable';
import { Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import '../ElectionSection.css';
import sanitizeInput from '../../../Common/validatorInput';
import { fetchTables, postTable } from './TableUtils';
import CustomPieChart from '../../CustomPieChart';

const Tables = () => {
  const { electionId, electionEditable } = useElection();
  const [tables, setTables] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadTableModal, setShowUploadTableModal] = useState(false);
  const [showViewTableModal, setShowViewTableModal] = useState(false);
  const [tablesData, setTablesData] = useState([]);
  const [isFileValid, setIsFileValid] = useState(false);
  const [tableData, setTableData] = useState({
    country: '', 
    state: '',
    city: '',
    address: '',
    uuid: '',
  });
  const [showHelp, setShowHelp] = useState(false);
  const [pieData, setPieData] = useState([]);

  const toggleHelpModal = () => setShowHelp(!showHelp);

  const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
          Ayuda
      </Tooltip>
  );

  const getRandomColor = () => {
    const colorValues = [
        Math.floor(Math.random() * 76) + 180, // Rango entre 180 y 255
        Math.floor(Math.random() * 51) + 110, // Rango entre 110 y 160
        Math.floor(Math.random() * 21),       // Rango entre 0 y 20
    ];
    
    // Mezclar el orden de los valores de color
    for (let i = colorValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [colorValues[i], colorValues[j]] = [colorValues[j], colorValues[i]];
    }
    
    return `rgb(${colorValues[0]}, ${colorValues[1]}, ${colorValues[2]})`;
  };

  useEffect(() => {
    const fetchData = async () => {
        const data = await fetchTables(electionId);
        setTables(data);

        const stateCounts = data.reduce((acc, table) => {
          acc[table.location.state] = (acc[table.location.state] || 0) + 1;
          return acc;
        }, {});
    
        const chartData = Object.entries(stateCounts).map(([state, count]) => ({
          name: state,
          color: getRandomColor(),
          value: count
        }));
    
        setPieData(chartData);
    };
    fetchData();
  }, [electionId]);

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
  
      const requiredColumns = ['id', 'country', 'state', 'city', 'address'];
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
            const updatedTables = await fetchTables(electionId);
            setTables(updatedTables); 
        } else {
            console.error('Error al actualizar la mesa:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
    setShowUploadTableModal(false);
  };

  const handleTablesSubmit = async (e) => {
    e.preventDefault();
    handleCloseUploadModal();

    const results = await Promise.all(
        tablesData.map(tableData => postTable(tableData, electionId))
    );

    if (results.includes(true)) {
        const updatedTables = await fetchTables(electionId);
        setTables(updatedTables);
    } else {
        console.log("No se pudieron guardar las mesas.");
    }
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
      const updatedTables = await fetchTables(electionId);
      setTables(updatedTables);
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
      <div style={{ display: 'flex' }}>
        <div style={{ width: '60vw' }}>
          <CustomTable 
            title="Mesas" 
            columns={columns} 
            rows={rows} 
            onRowClick={handleTableClick} 
            handleAddSelected={handleCreateTableClick}
            handleDeleteSelected={handleDeleteTables}
          />
        </div>
        <div style={{ paddingLeft: '20px', width: '40vw' }}>
          <div style={{
            borderRadius: '15px',
            padding: '10px'
          }}>
            <h3>Distribución de Mesas por Provincia</h3>
            <CustomPieChart pieData={pieData} />
          </div>
        </div>
      </div>

      <Modal show={showUploadModal} onHide={handleCloseUploadModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cargar Datos de Mesas</Modal.Title>
          <OverlayTrigger placement="right" overlay={renderTooltip}>
            <span
              style={{ cursor: "pointer", color: "#cccccc", marginLeft: '10px', fontSize: '20px' }}
              onClick={toggleHelpModal}
            >
              ?
            </span>
          </OverlayTrigger>
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

      <Modal show={showHelp} onHide={toggleHelpModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Instrucciones para el archivo Excel</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>El archivo Excel debe contener las siguientes columnas en este orden incluyendo en su primer fila el nombre de cada columna:</p>
          <ul>
            <li>id</li>
            <li>country</li>
            <li>state</li>
            <li>city</li>
            <li>address</li>
          </ul>
          <p>Ejemplo de formato:</p>

          <img
            src="/assets/example-table.png"
            alt="Ejemplo de Excel"
            style={{ width: '100%', maxHeight: '200px' }}
          />
        </Modal.Body>
      </Modal>

      <Modal show={showViewTableModal} onHide={handleCloseViewTableModal} centered>
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
      <Modal show={showUploadTableModal} onHide={handleCloseEditTableModal} centered>
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