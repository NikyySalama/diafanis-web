import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { Modal } from 'react-bootstrap';
import CustomTable from '../../CustomTable';
import '../ModalSection.css';
import sanitizeInput from '../../../Common/validatorInput';
import checkIMGByURL from '../../../Common/validatorURL';
const UserParties = () => {
    const { electionId, electionEditable } = useElection();
    const [parties, setParties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false); // Para modal de visualización
    const [formData, setFormData] = useState({
        logoUrl: '',
        colorHex: '',
        name: ''
    });
    const [clickedParty, setClickedParty] = useState(false);

    const fetchParties = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}/parties`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setParties(data);
            } else {
                console.error('Error al obtener los partidos', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de partidos', error);
        }
    };

    useEffect(() => {
        fetchParties();
    }, []);

    const handleCreatePartyClick = () => {
        setFormData({ logoUrl: '', colorHex: '', name: '' });
        setClickedParty(false); // Para asegurarse de que no esté editando
        setShowModal(true);
    };

    const handlePartyClick = (row) => {
        setFormData({
            logoUrl: row.logoUrl || '',
            colorHex: row.colorHex || '',
            name: row.name || '',
            uuid: row.uuid || ''
        });
        setShowViewModal(true); // Modal de visualización
    };

    const handleEditPartyClick = () => {
        if (electionEditable) {
            setShowViewModal(false); // Cierra el modal de visualización
            setClickedParty(true);   // Marca que estamos editando
            setShowModal(true);      // Abre el modal de edición
        }
        else
            alert('La eleccion ya no es editable.');
    };

    const handleClose = () => {
        setShowModal(false);
        setShowViewModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleAddParty = async (newParty) => {
        const partyData = {
            logoUrl: checkIMGByURL(newParty.logoUrl) ? newParty.logoUrl : "",
            colorHex: sanitizeInput(newParty.colorHex),
            name: sanitizeInput(newParty.name),
            electionUuid: electionId
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/parties`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(partyData)
            });

            if (response.ok) {
                const savedParty = await response.json();
                fetchParties();
            } else {
                console.error('Error al guardar el partido:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };

    const handleUpdateParty = async () => {
        const { logoUrl, colorHex, name, uuid } = formData;
        const partyData = {
            logoUrl: checkIMGByURL(logoUrl) ? logoUrl : "",
            colorHex: sanitizeInput(colorHex),
            name: sanitizeInput(name),
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/parties/${uuid}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(partyData)
            });

            if (response.ok) {
                const savedParty = await response.json();
                fetchParties();
            } else {
                console.error('Error al guardar el partido:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
        setClickedParty(false);
    };

    const validateImageUrl = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const contentType = response.headers.get('Content-Type');
            return contentType && contentType.startsWith('image/');
        } catch (error) {
            console.error('Error al validar la URL de la imagen:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValidImageUrl = await validateImageUrl(formData.logoUrl);
        if (!isValidImageUrl) {
            alert('La URL proporcionada no es una imagen válida.');
            return;
        }
        if (clickedParty) {
            handleUpdateParty();
        }
        else {
            handleAddParty(formData);
        }
        handleClose();
    };

    const handleDeleteParties = async (parties) => {
        if (!electionEditable) {
            alert('La eleccion ya no es editable.');
            return;
        }

        try {
            await Promise.all(
                parties.map(async (party) => {
                    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/parties/${party}`, {
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
            fetchParties();
        } catch (error) {
            console.error('Error al eliminar partidos', error);
        }
    };

    const columns = [
        { label: 'Nombre', field: 'name', align: 'left' },
    ];

    const rows = parties.map(party => ({
        uuid: party.uuid, // Necesario si estás usando selección
        name: party.name,
        logoUrl: party.logoUrl,
        colorHex: party.colorHex
    }));

    return (
        <div className="user-lists">
            <div className="my-section-header">
                {/*<h2 className="my-section-title">Sus Partidos</h2>
                <button className="add-section-button" onClick={handleCreatePartyClick}>
                    Crear Partido
                </button>*/}
            </div>

            <CustomTable
                title="Sus Partidos"
                columns={columns}
                rows={rows}
                onRowClick={(row) => handlePartyClick(row)}
                handleAddSelected={handleCreatePartyClick}
                handleDeleteSelected={handleDeleteParties}
                showImage={true}
            />

            {/* Modal de visualización */}
            <Modal show={showViewModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Partido</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Nombre: {formData.name}</p>
                    <p>Logo URL: <span className="url-display">{formData.logoUrl}</span></p>
                    {formData.logoUrl && (
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                            <img src={formData.logoUrl} alt="Logo Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                        </div>
                    )}
                    {formData.colorHex && (
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px'  }}>
                            <p style={{ marginRight: '10px', marginBottom: '0' }}>Color:</p>
                            <div
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    backgroundColor: formData.colorHex,
                                    marginRight: '10px',
                                    border: '1px solid #000',
                                }}
                            ></div>
                            <span>{formData.colorHex}</span>
                        </div>
                    )}
                    <button type="button" className="modal-button" onClick={handleEditPartyClick}>Editar</button>
                </Modal.Body>
            </Modal>

            {/* Modal de edición/creación */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{clickedParty ? 'Editar Partido' : 'Agregar Partido'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="logoUrl">Logo URL:</label>
                            <input
                                type="text"
                                id="logoUrl"
                                name="logoUrl"
                                value={formData.logoUrl}
                                onChange={handleChange}
                                placeholder="Ingrese la URL del logo"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="colorHex">Color:</label>
                            <input
                                type="color"
                                id="colorHex"
                                name="colorHex"
                                value={formData.colorHex}
                                onChange={handleChange}
                                placeholder="Ingrese el color"
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
                            Guardar
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserParties;