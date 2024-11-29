import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { IconButton } from '@mui/material'; 
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ElectionModal from '../../ModalElectionRegistration/ElectionModal';
import './ElectionInfo.css';

const formatDate = (dateString) => {
    if (!dateString) return { date: 'Fecha no disponible', time: '' };

    const date = new Date(dateString);
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };

    return {
        date: date.toLocaleDateString('es-ES', optionsDate),
        time: date.toLocaleTimeString('es-ES', optionsTime),
    };
};

const ElectionInfo = () => {
    const { electionId, electionEditable } = useElection();
    const [info, setInfo] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchInfo = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
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
                    positions: data.electionPositions,
                };
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
        if (electionEditable) setIsModalOpen(true);
        else alert('La elección ya no es editable.');
    };

    const closeModal = () => setIsModalOpen(false);

    const start = formatDate(info.startsAt);
    const end = formatDate(info.endsAt);

    return (
        <div className="election-info">
            <div className="header-container">
                <h2>Información de la elección</h2>
                <IconButton aria-label="edit" onClick={openModal}>
                    <EditIcon />
                </IconButton>
            </div>
            <h4>
                <span>{info.title}</span>
            </h4>
            <p>
                <span>{info.description}</span>
            </p>
            <div className="date-info">
                <div className="date-block">
                    <CalendarTodayIcon className="icon" />
                    <div>
                        <p className="date-label">Comienza</p>
                        <p>{start.date}</p>
                        <p>
                            <AccessTimeIcon className="time-icon" /> {start.time}
                        </p>
                    </div>
                </div>
                <div className="date-block">
                    <CalendarTodayIcon className="icon" />
                    <div>
                        <p className="date-label">Termina</p>
                        <p>{end.date}</p>
                        <p>
                            <AccessTimeIcon className="time-icon" /> {end.time}
                        </p>
                    </div>
                </div>
            </div>
            <p>
                <span className="label">Posiciones:</span>
            </p>
            <ul className="position-list">
                {info.positions &&
                    info.positions.map((position) => (
                        <li key={position.uuid} className="position-item">
                            <span className="position-title">{position.title}</span>
                            {position.description && (
                                <span className="position-description">
                                    {' '}
                                    - {position.description}
                                </span>
                            )}
                        </li>
                    ))}
            </ul>

            <ElectionModal
                show={isModalOpen}
                onClose={closeModal}
                onAddElection={fetchInfo}
                initialData={info}
            />
        </div>
    );
};

export default ElectionInfo;