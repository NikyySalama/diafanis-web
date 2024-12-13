import React, { useState, useEffect } from "react";
import './ElectionRegistration.css';
import sanitizeInput from "../../Common/validatorInput";
import Switch, { SwitchProps } from '@mui/material/Switch';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 42,
    height: 20,
    padding: 0,
    display: 'flex',
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(22px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#1890ff',
          ...theme.applyStyles('dark', {
            backgroundColor: '#177ddc',
          }),
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 16,
      height: 16,
      borderRadius: 8,
      transition: theme.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 20 / 2,
      opacity: 1,
      backgroundColor: 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
      ...theme.applyStyles('dark', {
        backgroundColor: 'rgba(255,255,255,.35)',
      }),
    },
}));

const ElectionRegistration = ({ handleAddElection, handleContinue, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startsAt: '',
        endsAt: '',
        username: sessionStorage.getItem('user'),
        planLimit: JSON.parse(sessionStorage.getItem('planLimit')),
        paymentId : sessionStorage.getItem('paymentId'),
        imageUrl: '',
        allowBlankVote : false,
    });

 
    // Cuando initialData esté disponible, pre-rellena los campos del formulario
    useEffect(() => {
        if (initialData) {
            console.log("hay initial data: ", initialData);
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                startsAt: initialData.startsAt || '',
                endsAt: initialData.endsAt || '',
                username: initialData.username,
                planLimit: initialData.planLimit,
                paymentId: initialData.paymentId,
                imageUrl: initialData.imageUrl || '',
                allowBlankVote: initialData.allowBlankVote || false,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let valueSanitized = value;
        if(name !== 'imagen' && name !== 'imageUrl' && name !== 'startsAt' && name !== 'endsAt'){
            valueSanitized = sanitizeInput(value)
        }
        setFormData({
            ...formData,
            [name]: valueSanitized,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (new Date(formData.startsAt) < new Date()){
            alert('La fecha y hora de inicio deben ser posteriores a la fecha y hora actual.');
            return;
        }
        
        if (new Date(formData.startsAt) >= new Date(formData.endsAt)) {
            alert('La fecha y hora de inicio deben ser anteriores a la fecha y hora de fin.');
            return;
        }

        const electionData = {
            ...formData,
        };

        console.log("se publica", electionData);
        
        handleAddElection(electionData); // Actualiza o crea la elección
        handleContinue(); // Avanza a la siguiente etapa (posiciones)
    };

    return (
        <div className="election-registration">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Nombre:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Descripción:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="startDate">Fecha y Hora de Inicio:</label>
                    <input
                        type="datetime-local"
                        id="startsAt"
                        name="startsAt"
                        value={formData.startsAt}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endDate">Fecha y Hora de Fin:</label>
                    <input
                        type="datetime-local"
                        id="endsAt"
                        name="endsAt"
                        value={formData.endsAt}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="title">Imágen:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                    />
                </div>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <label htmlFor="allowBlankVote">Voto en blanco:</label>
                    <AntSwitch 
                        checked={formData.allowBlankVote}
                        inputProps={{ 'aria-label': 'ant design' }} 
                        onChange={(e) => 
                            setFormData({
                                ...formData,
                                allowBlankVote: e.target.checked,
                            })
                        }
                    />
                </Stack>
                <button type="submit">Continuar</button>
            </form>
        </div>
    );
};

export default ElectionRegistration;