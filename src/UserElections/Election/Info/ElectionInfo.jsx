import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import { Box, Typography, Divider, List, ListItem, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ElectionModal from '../../ModalElectionRegistration/ElectionModal';
import './ElectionInfo.css';
import sanitizeInput from '../../../Common/validatorInput';
import ErrorLimitModal from '../ErrorLimitModal';

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
    const [modalErrorData, setErrorModalData] = useState({ isOpen: false, message: '', maxAllowed: null });

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
                    planLimit: data.planLimit,
                    paymentId: 8789798797,
                    username : data.username,
                    allowBlankVote: data.allowBlankVote
                }
                console.log('Datos filtrados:', dataFiltered);
                setInfo(dataFiltered);
            } else {
                console.error('Error al obtener los datos de la elección', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud', error);
        }
    };

    useEffect(() => {
        if (electionId) {
            fetchInfo();
        }
    }, [electionId]);

    const handleAddPosition = async (position, electionUuid) => {
        const positionToSend = {
          title: sanitizeInput(position.title),
          description: '',
          electionUuid: electionUuid,
        };
    
        try {
          let response;
          if (position.uuid) {
            console.log("uuid: ", position.uuid);
            // Si la posición ya tiene un uuid, hacemos un PUT
            response = await fetch(`${process.env.REACT_APP_API_URL}/api/electionPositions/${position.uuid}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
              },
              body: JSON.stringify(positionToSend),
            });
          } else {
            // Si la posición no tiene uuid, hacemos un POST
            response = await fetch(`${process.env.REACT_APP_API_URL}/api/electionPositions`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
              },
              body: JSON.stringify(positionToSend),
            });
          }
    
          if (response.ok) {
            const savedPosition = await response.json();
          } else {
            const responseBody = await response.json().catch(() => null);
            if (responseBody?.message === "El número total de posiciones excede el límite permitido.") {
              setErrorModalData({
                isOpen: true,
                message: responseBody.message,
                maxAllowed: responseBody.maxAllowed,
              });
            }
            throw new Error(`Error en la agregación de posición: ${response.status}`);
          }
        } catch (error) {
          console.error('Error en la solicitud:', error);
        }
    };

    const openModal = () => {
        if (electionEditable) setIsModalOpen(true);
        else alert('La elección ya no es editable.');
    };

    const closeModal = () => setIsModalOpen(false);

    const start = formatDate(info.startsAt);
    const end = formatDate(info.endsAt);

    return (
        <>
            <Box
            sx={{
                padding: 4,
                maxWidth: 600,
                margin: 'auto',
                backgroundColor: '#f9f9f9',
                borderRadius: 2,
                boxShadow: 3,
            }}
        >
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight="bold">
                    Información de la elección
                </Typography>
                <IconButton aria-label="edit" onClick={openModal}>
                    <EditIcon />
                </IconButton>
            </Box>
            <Box display="flex" alignItems="center" gap={2} marginTop={2}>
        {/* Imagen circular */}
        <Box display="flex" alignItems="center" gap={1}>
            {info.imageUrl &&
                <Box
                component="img"
                src={info.imageUrl}
                alt="Imágen de la elección"
                sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '7px'
                }}
            />}
            {/* Título de la información */}
            <Typography variant="h5" color="textSecondary" sx = {{marginBottom: '7px'}}>
                {info.title || 'Título no disponible'}
            </Typography>
        </Box>
        </Box>
            <Typography variant="body1" gutterBottom>
                {info.description || 'Descripción no disponible'}
            </Typography>
            <Divider sx={{ marginY: 2 }} />
            <Box>
                <Typography marginBottom={1} variant="subtitle1" fontWeight="bold">
                    Comienza
                </Typography>
                <Box marginBottom={1} display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon />
                    <Typography>{start.date}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon />
                    <Typography>{start.time}</Typography>
                </Box>
            </Box>
            <Box marginTop={2}>
                <Typography marginBottom={1} variant="subtitle1" fontWeight="bold">
                    Termina
                </Typography>
                <Box marginBottom={1} display="flex" alignItems="center" gap={1}>
                    <CalendarTodayIcon />
                    <Typography>{end.date}</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                    <AccessTimeIcon />
                    <Typography>{end.time}</Typography>
                </Box>
            </Box>
            <Box marginTop={2}>
                <Typography marginBottom={1} variant="subtitle1" fontWeight="bold">
                    Voto en blanco
                </Typography>
                <Box marginBottom={1} display="flex" alignItems="center" gap={1}>
                    <Typography>{info.allowBlankVote? "Habilitado" : "Deshabilitado"}</Typography>
                </Box>
            </Box>
            <Box marginTop={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                    Posiciones
                </Typography>
                <List disablePadding>
                    {info.positions ? (
                        info.positions.map((position) => (
                            <ListItem key={position.uuid}>
                                <Typography>
                                    {position.title} {position.description && `- ${position.description}`}
                                </Typography>
                            </ListItem>
                        ))
                    ) : (
                        <Typography>No hay posiciones disponibles.</Typography>
                    )}
                </List>
            </Box>
            <ElectionModal
                show={isModalOpen}
                onClose={closeModal}
                onAddElection={fetchInfo}
                handleAddPosition={handleAddPosition}
                initialData={info}
            />
        </Box>
        
        <ErrorLimitModal
            isOpen={modalErrorData.isOpen}
            message={modalErrorData.message}
            maxAllowed={modalErrorData.maxAllowed}
            onClose={() => setErrorModalData({ ...modalErrorData, isOpen: false })}
        />
        </>
    );
};

export default ElectionInfo;