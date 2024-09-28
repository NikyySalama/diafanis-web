import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { IconButton } from '@mui/material';  // Importar IconButton
import EditIcon from '@mui/icons-material/Edit';
import ElectionModal from '../../ModalElectionRegistration/ElectionModal';
import './ElectionInfo.css';

const ElectionInfo = () => {
    const { electionId, electionEditable } = useElection();
    const [info, setInfo] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchInfo = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/elections/${electionId}`, {
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
            <p>Título: {info.title}</p>
            <p>Descripción: {info.description}</p>
            <p>Comienza: {info.startsAt}</p>
            <p>Termina: {info.endsAt}</p>
            <p>Posiciones:</p>
            <ul>
                {info.positions && info.positions.map((position) => (
                    <li key={position.uuid}>
                        {position.title} - {position.description}
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
