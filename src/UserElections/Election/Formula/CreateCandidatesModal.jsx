import React, { useState } from 'react';
import { Modal, Tooltip, OverlayTrigger } from 'react-bootstrap';

const CreateCandidatesModal = ({ show, onHide, handleFileUpload, handleSubmit, positions }) => {
    const [showHelp, setShowHelp] = useState(false);

    const toggleHelpModal = () => setShowHelp(!showHelp);

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Ayuda
        </Tooltip>
    );

    return (
        <>
            <Modal show={show} onHide={onHide} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Posiciones y Candidatos</Modal.Title>
                    
                    <OverlayTrigger placement="right" overlay={renderTooltip}>
                        <span
                            style={{ cursor: "pointer", color: "#cccccc", marginLeft: '10px', fontSize:'20px' }}
                            onClick={toggleHelpModal}
                        >
                          ?
                        </span>
                    </OverlayTrigger>
                </Modal.Header>
                
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        {positions.map((position, index) => (
                            <div key={position.uuid} className="form-group">
                                <label htmlFor={`position${index}`}>{position.title}</label>
                                <input
                                    type="file"
                                    id={`position${index}`}
                                    name={`position${index}`}
                                    accept=".xlsx, .xls"
                                    onChange={(e) => handleFileUpload(e, index)}
                                    required
                                />
                            </div>
                        ))}
                        <button type="submit" className="btn btn-primary">Subir Fórmulas</button>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Modal de ayuda */}
            <Modal show={showHelp} onHide={toggleHelpModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Instrucciones para el archivo Excel</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>
                    <p>El archivo Excel debe contener las siguientes columnas en este orden incluyendo en su primer fila el nombre de cada columna:</p>
                    <ul>
                        <li>docNumber</li>
                        <li>name</li>
                        <li>lastName</li>
                        <li>imageUrl</li>
                        <li>role</li>
                    </ul>
                    <p>Ejemplo de formato:</p>
                    
                    <img 
                        src="/assets/example-formula.png" 
                        alt="Ejemplo de Excel" 
                        style={{ width: '100%', maxHeight: '200px' }}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default CreateCandidatesModal;