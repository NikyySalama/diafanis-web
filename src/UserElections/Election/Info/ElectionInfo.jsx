import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { IconButton } from '@mui/material';  // Importar IconButton
import EditIcon from '@mui/icons-material/Edit';
import ElectionModal from '../../ModalElectionRegistration/ElectionModal';
import './ElectionInfo.css';

const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';

    const date = new Date(dateString);
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };

    const formattedDate = date.toLocaleDateString('es-ES', optionsDate);
    const formattedTime = date.toLocaleTimeString('es-ES', optionsTime);

    return `${formattedDate} a las ${formattedTime}`;
};

const ElectionInfo = () => {
    const { electionId, electionEditable } = useElection();
    const [info, setInfo] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchInfo = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const dataFiltered = {
                    uuid: data.uuid,
                    title: data.title,
                    description: data.description,
                    imageUrl: data.imageUrl,
                    endsAt: data.endsAt,
                    startsAt: data.startsAt,
                    positions: data.electionPositions
                }
                setInfo(dataFiltered);
            } else {
                console.error('Error al obtener los partidos', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud de partidos', error);
        }
    };

    useEffect(() => {
        if (electionId) {
            fetchInfo();
        }
    }, [electionId]);

    const openModal = () => {
        if(electionEditable)
            setIsModalOpen(true);
        else
            alert('La eleccion ya no es editable.');
    }
    const closeModal = () => setIsModalOpen(false);

    return (
        <div className='election-info'>
            <div className='edit-icon-container'>
                <IconButton aria-label="edit" onClick={openModal}>
                    <EditIcon />
                </IconButton>
            </div>
            <h2>Información de la elección</h2>
            <p><span className="label">Título:</span> <span className="value">{info.title}</span></p>
            <p><span className="label">Descripción:</span> <span className="value">{info.description}</span></p>
            <p><span className="label">Comienza:</span> <span className="value">{formatDate(info.startsAt)}</span></p>
            <p><span className="label">Termina:</span> <span className="value">{formatDate(info.endsAt)}</span></p>
            <p><span className="label">Posiciones:</span></p>
            <ul className="position-list">
                {info.positions && info.positions.map((position) => (
                    <li key={position.uuid} className="position-item">
                        <span className="position-title">{position.title}</span>
                        {position.description && <span className="position-description"> - {position.description}</span>}
                    </li>
                ))}
            </ul>

            <ElectionModal
                show={isModalOpen}
                onClose={closeModal}
                onAddElection={fetchInfo}
                initialData={info}  // Pasa los datos de la elección actual para editar
            />
        </div>
    );
};

export default ElectionInfo;
