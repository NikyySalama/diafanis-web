import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CustomTable from '../../CustomTable';
import * as XLSX from 'xlsx';
import '../ModalSection.css';
import checkIMGByURL from '../../../Common/validatorURL';
import sanitizeInput from '../../../Common/validatorInput';
import { fetchTables } from '../Tables/TableUtils';
import ErrorLimitModal from '../ErrorLimitModal';
import { VscSymbolParameter } from 'react-icons/vsc';

const UserVoters = () => {
    const { electionId, electionEditable } = useElection();
    const [voters, setVoters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditVoterModal, setShowEditVoterModal] = useState(false);
    const [tables, setTables] = useState([]);
    const [formData, setFormData] = useState({
        docNumber: '',
        docType: '',
        name: '',
        lastName: '',
        imageUrl: '',
        uuid: '',
    });
    const [clickedVoter, setClickedVoter] = useState(false);
    const [selectedTable, setSelectedTable] = useState('');
    const [file, setFile] = useState(null);
    const [showHelp, setShowHelp] = useState(false);
    const [modalErrorData, setErrorModalData] = useState({ isOpen: false, message: '', maxAllowed: null });

    const toggleHelpModal = () => setShowHelp(!showHelp);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ayuda
        </Tooltip>
    );

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

    useEffect(() => {
        fetchVoters();
        const fetchData = async () => {
            const data = await fetchTables(electionId);
            setTables(data);
        };

        fetchData();
    }, [electionId]);

    const handleCreateVotersClick = () => {
        setClickedVoter(false); // Para asegurarse de que no esté editando
        setShowModal(true);
    };

    const handleVoterClick = (row) => {
        setFormData({
            docNumber: row.docNumber || '',
            docType: row.docType || '',
            name: row.name || '',
            lastName: row.lastName || '',
            imageUrl: row.logoUrl || '',
            uuid: row.uuid || ''
        });
        setShowViewModal(true); // Modal de visualización
    };

    const handleEditVoterClick = () => {
        if (electionEditable) {
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
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: ['name', 'lastName', 'imageUrl', 'docNumber', 'docType'] });

            const votersData = jsonData.slice(1).map(voter => ({
                ...voter,
                docNumber: Number(voter.docNumber), // Convertir `docNumber` a número
            }));

            // Validar que todos los `docNumber` sean números válidos
            if (votersData.some(voter => isNaN(voter.docNumber))) {
                alert('El archivo Excel contiene valores no válidos en la columna docNumber.');
                return;
            }

            // Validar estructura del archivo
            if (!jsonData.length || !jsonData[0].name || !jsonData[0].lastName || !jsonData[0].imageUrl || !jsonData[0].docNumber || !jsonData[0].docType) {
                alert('La estructura del archivo Excel no es correcta. Asegúrese de tener las columnas: name, lastName, imageUrl, docNumber, docType.');
                return;
            }
            const sanitizedVotersData = votersData.map(voter => ({
                name: sanitizeInput(voter.name),
                lastName: sanitizeInput(voter.lastName),
                imageUrl: checkIMGByURL(voter.imageUrl) ? voter.imageUrl : '',
                docNumber: Number(voter.docNumber),
                docType: voter.docType,
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
                electorTableUuid: selectedTable,
                electionUuid: electionId
            }));
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tables/${selectedTable}/electors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(updatedVotersData),
            });

            if (response.ok) {
                fetchVoters();
                handleClose();
            } else {
                const responseBody = await response.json().catch(() => null);
                console.error('Error al guardar la fórmula:', {
                    status: response.status,
                    statusText: response.statusText,
                    errorBody: responseBody,
                  });  
      
                  if (responseBody?.message?.startsWith("El número total de ")) {
                    handleClose();
                    setErrorModalData({
                      isOpen: true,
                      message: responseBody.message,
                      maxAllowed: responseBody.maxAllowed,
                    });
                  }
                throw new Error(`Error al subir los votantes: ${response.status}`);
            }
        } catch (error) {
            console.error('Error en la solicitud de votantes', error);
        }
    };

    const handleSubmitVoter = async () => {
        console.log("data: ", formData);

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/persons/${electionId}/${formData.uuid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
                },
                body: JSON.stringify({
                    docNumber: formData.docNumber,
                    docType: formData.docType,
                    name: sanitizeInput(formData.name),
                    lastName: sanitizeInput(formData.lastName),
                    imageUrl: formData.imageUrl,
                    electionUuid: electionId
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

    const handleDeleteVoters = async (votersUuids) => { // TODO: mirar con backend el problema de borrado
        if (!electionEditable) {
            alert('La eleccion ya no es editable.');
            return;
        }

        try {
            await Promise.all(
                votersUuids.map(async (voterUuid) => {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/persons/${electionId}/${voterUuid}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
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
        uuid: voter.docNumber, // Necesario si estás usando selección
        name: voter.name,
        lastName: voter.lastName,
        docNumber: voter.docNumber,
        docType: voter.docType,
        logoUrl: voter.imageUrl,
    }));

    return (
        <div>
            <CustomTable
                title="Votantes"
                columns={columns}
                rows={rows}
                onRowClick={(row) => handleVoterClick(row)}
                handleAddSelected={handleCreateVotersClick}
                handleDeleteSelected={handleDeleteVoters}
                showImage={true}
            />

            {/* Modal de visualización */}
            <Modal show={showViewModal} onHide={handleClose} centered>
                <Modal.Header closeButton style={{ borderBottom: "none", paddingBottom: "0px" }}>
                </Modal.Header>
                <Modal.Body>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "20px",
                            backgroundColor: "#f9f9f9",
                        }}
                    >
                        {/* Imagen del documento */}
                        <div style={{ flex: "0 0 auto", marginRight: "20px" }}>
                            {formData.imageUrl ? (
                                <img
                                    src={formData.imageUrl}
                                    alt="Foto Documento"
                                    style={{
                                        width: "150px",
                                        height: "200px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                    }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backgroundColor: "#e0e0e0",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                        color: "#777",
                                        fontSize: "12px",
                                    }}
                                >
                                    Imagen no disponible
                                </div>
                            )}
                        </div>

                        {/* Detalles del votante */}
                        <div style={{ flex: "1 1 auto" }}>
                            {/* Apellido */}
                            <div style={{ marginBottom: "10px" }}>
                                <small style={{ fontWeight: "bold", color: "#555" }}>
                                    Apellido / Surname
                                </small>
                                <div style={{ fontSize: "18px", fontWeight: "500" }}>
                                    {formData.lastName || "No disponible"}
                                </div>
                            </div>

                            {/* Nombre */}
                            <div style={{ marginBottom: "10px" }}>
                                <small style={{ fontWeight: "bold", color: "#555" }}>
                                    Nombre / Name
                                </small>
                                <div style={{ fontSize: "18px", fontWeight: "500" }}>
                                    {formData.name || "No disponible"}
                                </div>
                            </div>

                            {/* Documento */}
                            <div>
                                <small style={{ fontWeight: "bold", color: "#555" }}>
                                    Documento / Document
                                </small>
                                <div style={{ fontSize: "22px", fontWeight: "bold" }}>
                                    {formData.docNumber || "No disponible"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" className="modal-button" onClick={handleEditVoterClick}>Editar</button>
                </Modal.Body>
            </Modal>

            {/* Modal para agregar votantes */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Votantes</Modal.Title>
                    <OverlayTrigger placement="right" overlay={renderTooltip}>
                        <span
                            style={{
                                cursor: "pointer",
                                color: "#6c757d",
                                marginLeft: "10px",
                                fontSize: "20px",
                            }}
                            onClick={toggleHelpModal}
                        >
                            ?
                        </span>
                    </OverlayTrigger>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Seleccione una Mesa:</label>
                        <select
                            value={selectedTable}
                            onChange={handleTableChange}
                            className="form-select"
                        >
                            <option value="">Seleccione...</option>
                            {tables.map((table) => (
                                <option key={table.uuid} value={table.uuid}>
                                    {table.location.city} - {table.location.address}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Subir archivo Excel:</label>
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                            className="form-control"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-primary w-100"
                        onClick={handleSubmit}
                    >
                        Subir Votantes
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={showHelp} onHide={toggleHelpModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Instrucciones para el archivo Excel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>El archivo Excel debe contener las siguientes columnas en este orden incluyendo en su primer fila el nombre de cada columna:</p>
                    <ul>
                        <li>name</li>
                        <li>lastName</li>
                        <li>imageUrl</li>
                        <li>docNumber</li>
                        <li>docType</li>
                    </ul>
                    <p>Ejemplo de formato:</p>

                    <img
                        src="/assets/example-voters.png"
                        alt="Ejemplo de Excel"
                        style={{ width: '100%', maxHeight: '200px' }}
                    />
                </Modal.Body>
            </Modal>

            {/* Modal para editar votante */}
            <Modal show={showEditVoterModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Votante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ marginBottom: "15px" }}>
                        <label>Nro. Documento:</label>
                        <input
                            type="text"
                            name="docNumber"
                            value={formData.docNumber}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div style={{ marginBottom: "15px" }}>
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
            <ErrorLimitModal
                isOpen={modalErrorData.isOpen}
                message={modalErrorData.message}
                maxAllowed={modalErrorData.maxAllowed}
                onClose={() => setErrorModalData({ ...modalErrorData, isOpen: false })}
            />
        </div>
    );
};

export default UserVoters;