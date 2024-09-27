import React, { useState, useEffect } from "react";
import './ElectionRegistration.css';

const ElectionRegistration = ({ handleAddElection, handleContinue, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startsAt: '',
        endsAt: '',
    });

    // Cuando initialData esté disponible, pre-rellena los campos del formulario
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                startsAt: initialData.startsAt || '',
                endsAt: initialData.endsAt || '',
            });
            console.log(initialData);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (new Date(formData.startsAt) >= new Date(formData.endsAt)) {
            alert('La fecha y hora de inicio deben ser anteriores a la fecha y hora de fin.'); // Mostrar alerta
            return;
        }

        const electionData = {
            ...formData,
        };
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
                <button type="submit">Continuar</button>
            </form>
        </div>
    );
};

export default ElectionRegistration;