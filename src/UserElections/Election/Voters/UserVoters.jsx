import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { Modal } from 'react-bootstrap';
import CustomTable from '../../CustomTable';
import * as XLSX from 'xlsx';
import '../ModalSection.css';
import checkIMGByURL from '../../../Common/validatorURL';
import sanitizeInput from '../../../Common/validatorInput';
const UserVoters = () => {
    const { electionId, electionEditable } = useElection();
    const [voters, setVoters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false); // Para modal de visualización
    const [showEditVoterModal, setShowEditVoterModal] = useState(false);
    const [votersData, setVotersData] = useState([]);
    const [tables, setTables] = useState([]);
    const [formData, setFormData] = useState({
        docNumber: '', 
        name: '',
        lastName: '',
        imageUrl: '',
        uuid: '',
    });
    const [clickedVoter, setClickedVoter] = useState(false);
    const [selectedTable, setSelectedTable] = useState('');
    const [file, setFile] = useState(null);

    const fetchVoters = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setVoters(data.people);
            } else {
                console.error('Error al obtener los votantes', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de votantes', error);
        }
    };

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
            console.log("mesas: ", data);
            setTables(data); // Guardamos las mesas tal como llegan
          } else {
            console.error('Error al obtener las mesas', response.statusText);
          }
        } catch (error) {
          console.error('Error en la solicitud de mesas', error);
        }
    };

    useEffect(() => {
        fetchVoters();
        fetchTables();
    }, []);

    const handleCreateVotersClick = () => {
        setClickedVoter(false); // Para asegurarse de que no esté editando
        setShowModal(true);
    };

    const handleVoterClick = (row) => {
        setFormData({
            docNumber: row.docNumber || '', 
            name: row.name || '',
            lastName: row.lastName || '',
            imageUrl: row.imageUrl || '',
            uuid: row.uuid || ''
        });
        setShowViewModal(true); // Modal de visualización
    };

    const handleEditVoterClick = () => {
        if(electionEditable){
            setShowViewModal(false); // Cierra el modal de visualización
            setClickedVoter(true);   // Marca que estamos editando
            setShowEditVoterModal(true);      // Abre el modal de edición
        }
        else
            alert('La eleccion ya no es editable.');
    };

    const handleClose = () => {
        setShowModal(false);
        setShowViewModal(false);
        setShowEditVoterModal(false);
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

            const votersData = jsonData.slice(1);

            // Validar estructura del archivo
            if (!jsonData.length || !jsonData[0].name || !jsonData[0].lastName || !jsonData[0].imageUrl || !jsonData[0].docNumber) {
                alert('La estructura del archivo Excel no es correcta. Asegúrese de tener las columnas: name, lastName, imageUrl, docNumber.');
                return;
            }
            const sanitizedVotersData = votersData.map(voter => ({
                name: sanitizeInput(voter.name),
                lastName: sanitizeInput(voter.lastName),
                imageUrl: checkIMGByURL(voter.imageUrl) ? voter.imageUrl : '',
                docNumber: sanitizeInput(voter.docNumber),
            }));
            // Enviar los datos al endpoint
            addVoters(sanitizedVotersData);
        };
        reader.readAsArrayBuffer(file);
    };

    const addVoters = async (votersData) => {
        try {
            const updatedVotersData = votersData.map(voter => ({
                ...voter,
                docType: 'DNI',
                electorTableUuid: selectedTable,
                electionUuid: electionId
            }));
    
            console.log("voters: ", updatedVotersData);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tables/${selectedTable}/electors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(updatedVotersData),
            });
    
            if (response.ok) {
                fetchVoters();
                handleClose();
            } else {
                console.error('Error al subir los votantes', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de votantes', error);
        }
    };  
    
    const handleSubmitVoter = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/persons/${formData.uuid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
                },
                body: JSON.stringify({
                    docNumber: sanitizeInput(formData.docNumber),
                    name: sanitizeInput(formData.name),
                    lastName: sanitizeInput(formData.lastName),
                }),
            });

            if (response.ok) {
                fetchVoters();
                handleClose();
            } else {
                console.error('Error al actualizar el votante', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de actualización de votante', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleDeleteVoters = async (voters) => {
        if(!electionEditable){
            alert('La eleccion ya no es editable.');
            return;
        }
         
        try {
            await Promise.all(
                voters.map(async (voter) => {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/persons/${voter}`, {
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
            fetchVoters();
        } catch (error) {
            console.error('Error al eliminar votantes', error);
        }
    };

    const columns = [
        { label: 'Nro. Documento', field: 'docNumber', align: 'left' },
        { label: 'Nombre', field: 'name', align: 'left' },
        { label: 'Apellido', field: 'lastName', align: 'left' },
    ];

    const rows = voters.map(voter => ({
        uuid: voter.uuid, // Necesario si estás usando selección
        name: voter.name,
        lastName: voter.lastName,
        docNumber: voter.docNumber,
        imageUrl: voter.imageUrl,
    }));

    return (
        <div>
            <CustomTable 
                title="Sus Votantes"
                columns={columns}
                rows={rows}
                onRowClick={(row) => handleVoterClick(row)}
                handleAddSelected={handleCreateVotersClick}
                handleDeleteSelected={() => {}}
            />

            {/* Modal de visualización */}
            <Modal show={showViewModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Votante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Nombre y apellido: {formData.name} {formData.lastName}</p>
                    <p>Documento: {formData.docNumber}</p>
                    {/*<button type="button" className="modal-button" onClick={handleEditVoterClick}>Editar</button>*/}
                </Modal.Body>
            </Modal>

            {/* Modal para agregar votantes */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Votantes</Modal.Title>
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
                    <button type="button" className="modal-button" onClick={handleSubmit}>Subir Votantes</button>
                </Modal.Footer>
            </Modal>

            {/* Modal para editar votante */}
            <Modal show={showEditVoterModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Votante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <label>Nro. Documento:</label>
                        <input
                            type="text"
                            name="docNumber"
                            value={formData.docNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Apellido:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="modal-button" onClick={handleSubmitVoter}>Guardar Cambios</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UserVoters;