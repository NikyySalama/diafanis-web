import React, { useState, useEffect } from 'react';
import { useElection } from '../ElectionContext';
import Party from './Party';
import { Modal } from 'react-bootstrap';
import '../Formula/UserLists.css';

const UserLists = () => {
    const electionId = useElection();
    const [parties, setParties] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        logo: '', 
        color: '',
        name: ''
    });

    const fetchParties = async () => {
        try{
        const response = await fetch('http://diafanis.com.ar/api/parties', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        });

        if(response.ok) {
            const data = await response.json();
            setParties(data);
        } else{
            console.error('error al obtener los partidos', response.statusText);
        }
        } catch(error){
            console.error('error en la solicitud de partidos', error);
        }
    }

    useEffect(() => {
        fetchParties();
    }, []);

    const handleCreatePartyClick = () => {
        setFormData({ logo: '', color: '', name: '' });
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value
        });
    };

    const handleAddParty = async (newParty) => {
        const partyData = {
            logo: newParty.logo,
            color: newParty.color,
            name: newParty.name,
            electionUuid: electionId
        };
        try {
        const response = await fetch('http://diafanis.com.ar/api/parties', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(partyData)
        });

        if (response.ok) {
            const savedParty = await response.json();
            console.log('Elección guardada:', savedParty);
            fetchParties(); 
        } else {
            console.error('Error al guardar la elección:', response.statusText);
        }
        } catch (error) {
        console.error('Error en la solicitud:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        handleAddParty(formData);
        handleClose();
    };

    return (
        <div className="user-lists">
        <h1 className="user-lists-title">Sus Partidos</h1>
        <button className="add-list-button" onClick={handleCreatePartyClick}>
            Crear Partido
        </button>
        <div className="lists-content">
            <div className="list-data">
            <span className="list-name">Nombre</span>
            </div>
            <ul className="lists-container">
            {parties.map((party, index) => (
                <li key={index}>
                <Party name={party.name} />
                </li>
            ))}
            </ul>
        </div>

        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
            <Modal.Title>Lista Datos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label htmlFor="logo">Logo URL:</label>
                <input
                    type="text"
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="Ingrese la url del logo"
                    required
                />
                </div>
                <div className="form-group">
                <label htmlFor="color">Color:</label>
                <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Ingrese color"
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

export default UserLists;
