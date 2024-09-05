import React, {useState} from "react"
import './ElectionRegistration.css'

const ElectionRegistration = ({onAddElection, handleContinue}) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startsAt: '',
        endsAt: '',
    });

    const handleChange = (e) => {
    const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newElection = {
            id: Date.now(),
            ...formData,
        };
        onAddElection(newElection);
        handleContinue();
    };

    return(
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
    )
}

export default ElectionRegistration