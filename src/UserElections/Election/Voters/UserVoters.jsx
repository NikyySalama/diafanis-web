import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { Modal } from 'react-bootstrap';
import CustomTable from '../../CustomTable';
import '../ModalSection.css';

const UserVoters = () => {
    const { electionId, electionEditable } = useElection();
    const [voters, setVoters] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false); // Para modal de visualización
    const [votersData, setVotersData] = useState([]);
    const [formData, setFormData] = useState({
        docNumber: '', 
        name: '',
        lastName: '',
        imageUrl: ''
    });
    const [clickedVoter, setClickedVoter] = useState(false);

    const fetchVoters = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/elections/${electionId}/persons`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setVoters(data);
            } else {
                console.error('Error al obtener los partidos', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de partidos', error);
        }
    };

    useEffect(() => {
        fetchVoters();
    }, []);

    const handleCreateVotersClick = () => {
        setClickedParty(false); // Para asegurarse de que no esté editando
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
            setShowModal(true);      // Abre el modal de edición
        }
        else
            alert('La eleccion ya no es editable.');
    };

    const handleClose = () => {
        setShowModal(false);
        setShowViewModal(false);
    };

    const handleAddVoters = async (newVoters) => {
        
    };

    const handleUpdateVoter = async () => {
        
    };

    const handleSubmit = async (e) => {
        
    };

    const handleDeleteVoters = async (voters) => {
        if(!electionEditable){
            alert('La eleccion ya no es editable.');
            return;
        }
         
        try {
            await Promise.all(
                voters.map(async (voter) => {
                    const response = await fetch(`http://localhost:8080/api/persons/${voter}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                    });

                    if (!response.ok) {
                        throw new Error(`Error en la respuesta del servidor: ${response.status}`);
                    }
                })
            );
            fetchParties();
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
            <div className="my-section-header">
                {/*<h2 className="my-section-title">Sus Votantes</h2>
                <button className="add-section-button" onClick={handleCreateVotersClick}>
                    Crear Votantes
                </button>*/}
            </div>

            <CustomTable 
                title="Sus Votantes"
                columns={columns}
                rows={rows}
                onRowClick={(row) => handleVoterClick(row)}
                handleAddSelected={handleCreateVotersClick}
                handleDeleteSelected={handleDeleteVoters}
            />

            {/* Modal de visualización */}
            <Modal show={showViewModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del Votante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Nombre y apellido: {formData.name} {formData.lastName}</p>
                    <p>Documento: {formData.docNumber}</p>
                    <button type="button" className="modal-button" onClick={handleEditVoterClick}>Editar</button>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserVoters;