import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { Modal } from 'react-bootstrap';
import CustomTable from '../../CustomTable';
import AuthoritiesTable from './AuthoritiesTable';
import * as XLSX from 'xlsx';
import '../ModalSection.css';

const UserAuthorities = () => {
    const { electionId, electionEditable } = useElection();
    const [showModal, setShowModal] = useState(false);
    const [tables, setTables] = useState([]);
    const [formData, setFormData] = useState({
        docNumber: '', 
        name: '',
        lastName: '',
        imageUrl: ''
    });
    const [clickedTable, setClickedTable] = useState(false);
    const [selectedTable, setSelectedTable] = useState('');
    const [file, setFile] = useState(null);

    const fetchTables = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/elections/${electionId}/tables`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const data = await response.json();
            console.log("mesas: ", data);
            setTables(data); // Guardamos las mesas tal como llegan
            console.log("mesas", data);
          } else {
            console.error('Error al obtener las mesas', response.statusText);
          }
        } catch (error) {
          console.error('Error en la solicitud de mesas', error);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleCreateAuthoritiesClick = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedTable('');
        setFile(null);
    };

    const handleTableChange = (e) => {
        setSelectedTable(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!selectedTable) {
            alert('Por favor seleccione una mesa.');
            return;
        }

        if (!file) {
            alert('Por favor suba un archivo Excel.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['name', 'lastName', 'imageUrl', 'docNumber'] });

            const authoritiesData = jsonData.slice(1);

            // Validar estructura del archivo
            if (!jsonData.length || !jsonData[0].name || !jsonData[0].lastName || !jsonData[0].imageUrl || !jsonData[0].docNumber) {
                alert('La estructura del archivo Excel no es correcta. Asegúrese de tener las columnas: name, lastName, imageUrl, docNumber.');
                return;
            }

            // Enviar los datos al endpoint
            addAuthorities(authoritiesData);
        };
        reader.readAsArrayBuffer(file);
    };

    const addAuthorities = async (authoritiesData) => {
        try {
            const updatedAuthoritiesData = authoritiesData.map(authority => ({
                ...authority,
                docType: 'DNI',
                electorTableUuid: selectedTable,
                electionUuid: electionId
            }));
    
            const response = await fetch(`http://localhost:8080/api/tables/${selectedTable}/authorities`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(updatedAuthoritiesData),
            });
    
            if (response.ok) {
                fetchTables();
                handleClose();
            } else {
                console.error('Error al subir las autoridades', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de autoridades', error);
        }
    };

    const columns = [
        { label: 'Numero', field: 'id', align: 'left' },
        { label: 'Ciudad', field: 'city', align: 'left' },
        { label: 'Direccion', field: 'address', align: 'left' },
        { label: 'Cant. Autoridades', field: 'cant', align: 'left' },
    ];

    const rows = tables.map((table, index) => ({
        uuid: table.uuid,
        id: index + 1,
        city: table.location.city,
        address: table.location.address,
        authorities: table.authorities,
        cant: Array.isArray(table.authorities) ? `${table.authorities.length}` : '0',
    }));

    return (
        <div>
            {/*<CustomTable 
                title="Sus Autoridades de Mesa"
                columns={columns}
                rows={rows}
                handleAddSelected={handleCreateAuthoritiesClick}
            />*/}

            <AuthoritiesTable 
                title="Sus Autoridades de Mesa"
                columns={columns}
                rows={rows}
                handleAddSelected={handleCreateAuthoritiesClick}
            />

            {/* Modal para agregar autoridades */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Autoridades de Mesa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Seleccione una Mesa:</label>
                        <select value={selectedTable} onChange={handleTableChange}>
                            <option value="">Seleccione...</option>
                            {tables.map((table) => (
                                <option key={table.uuid} value={table.uuid}>
                                    {table.location.city} - {table.location.address}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Subir archivo Excel:</label>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="modal-button" onClick={handleSubmit}>Subir Autoridades</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserAuthorities;