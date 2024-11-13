import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import AuthoritiesTable from './AuthoritiesTable';
import * as XLSX from 'xlsx';
import '../ModalSection.css';
import checkIMGByURL from '../../../Common/validatorURL';
import sanitizeInput from '../../../Common/validatorInput';
import { fetchTables } from '../Tables/TableUtils';
import { addAuthorities } from './AuthoritiesUtils';

const UserAuthorities = () => {
    const { electionId, electionEditable } = useElection();
    const [showModal, setShowModal] = useState(false);
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [file, setFile] = useState(null);
    const [showHelp, setShowHelp] = useState(false);

    const toggleHelpModal = () => setShowHelp(!showHelp);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ayuda
        </Tooltip>
    );

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchTables(electionId);
            setTables(data);
        };
        
        fetchData();
    }, [electionId]);    

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

        const validExtensions = ['.xls', '.xlsx'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
    
        if (!validExtensions.includes(`.${fileExtension}`)) {
            alert('Por favor suba un archivo Excel válido (.xls o .xlsx).');
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

            if (!jsonData.length || !jsonData[0].name || !jsonData[0].lastName || !jsonData[0].imageUrl || !jsonData[0].docNumber) {
                alert('La estructura del archivo Excel no es correcta. Asegúrese de tener las columnas: name, lastName, imageUrl, docNumber.');
                return;
            }
            const sanitizedAuthoritiesData = authoritiesData.map(authority => ({
                name: sanitizeInput(authority.name),
                lastName: sanitizeInput(authority.lastName),
                imageUrl: checkIMGByURL(authority.imageUrl) ? authority.imageUrl : '',
                docNumber: sanitizeInput(authority.docNumber),
            }));
            if (addAuthorities(electionId, selectedTable, sanitizedAuthoritiesData)){
                fetchTables();
                handleClose();
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDeleteAuthoritiesSelected = async (selectedAuthorities) => {
        console.log('autoridades de mesa: ', selectedAuthorities);
        try {
            for (const [rowUuid, docNumbers] of Object.entries(selectedAuthorities)) {
                for (const docNumber of docNumbers) {
                    console.log('dni', docNumber);
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/persons/${electionId}/${docNumber}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
                        },
                        body: JSON.stringify({ authorityTableUuid: null }),
                    });
    
                    if (!response.ok) {
                        console.error(`Error al eliminar la autoridad con docNumber ${docNumber}:`, response.statusText);
                    }
                }
            }
    
            fetchTables();
        } catch (error) {
            console.error('Error en la solicitud de eliminación de autoridades', error);
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
            <AuthoritiesTable 
                title="Autoridades de Mesa"
                columns={columns}
                rows={rows}
                handleAddSelected={handleCreateAuthoritiesClick}
                handleDeleteSelected={handleDeleteAuthoritiesSelected}
            />

            {/* Modal para agregar autoridades */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Autoridades de Mesa</Modal.Title>
                    <OverlayTrigger placement="right" overlay={renderTooltip}>
                        <span
                            style={{ cursor: "pointer", color: "#cccccc", marginLeft: '10px', fontSize:'20px' }}
                            onClick={toggleHelpModal}
                        >
                          ?
                        </span>
                    </OverlayTrigger>
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

            <Modal show={showHelp} onHide={toggleHelpModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Instrucciones para el archivo Excel</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <p>El archivo Excel debe contener las siguientes columnas en este orden incluyendo en su primer fila el nombre de cada columna:</p>
                    <ul>
                        <li>docNumber</li>
                        <li>name</li>
                        <li>lastName</li>
                        <li>imageUrl</li>
                        <li>role</li>
                    </ul>
                    <p>Ejemplo de formato:</p>
                    
                    <img 
                        src="/assets/example-voters.png" 
                        alt="Ejemplo de Excel" 
                        style={{ width: '100%', maxHeight: '200px' }}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserAuthorities;