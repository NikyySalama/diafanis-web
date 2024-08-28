import React from 'react';
import './PollingStationOrLists.css';
import { useNavigate } from 'react-router-dom';

const CustomModal = ({ election, onClose, onMesasClick }) => {
    const navigate = useNavigate();
    const onListasClick = () => {
        navigate('/lists');
    }

    return (
        <div className="custom-modal">
            <div className="custom-modal-content">
                <h2>{election}</h2>
                <div className="modal-buttons">
                    <button onClick={onMesasClick} className="modal-button">Mesas</button>
                    <button onClick={onListasClick} className="modal-button">Listas</button>
                </div>
                <button onClick={onClose} className="close-button">Cerrar</button>
            </div>
        </div>
    );
};

export default CustomModal;
