import React from 'react';
import PropTypes from 'prop-types';

const ErrorLimitModal = ({ isOpen, message, maxAllowed, onClose }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
        >
            <div 
                style={{
                    background: "#fff",
                    padding: "30px",
                    borderRadius: "12px",
                    maxWidth: "500px",
                    width: "90%",
                    textAlign: "center",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
                }}
            >
                {/* Encabezado con ícono y texto */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px",
                }}>
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="48" 
                        height="48" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#ff4d4f" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ marginRight: "10px" }}
                    >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <h2 style={{
                        fontSize: "1.5rem",
                        color: "#333",
                        margin: 0,
                    }}>Error</h2>
                </div>

                <p style={{
                    fontSize: "1rem",
                    color: "#555",
                    marginBottom: "10px",
                }}>{message}</p>

                {(
                    <p style={{
                        fontSize: "0.9rem",
                        color: "#888",
                        marginBottom: "20px",
                    }}>Límite permitido: {maxAllowed}</p>
                )}

                <div>
                    <button 
                        style={{
                            margin: "5px 10px",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "7px",
                            cursor: "pointer",
                            backgroundColor: "#ccc",
                            color: "#333",
                            fontWeight: "bold",
                        }} 
                        onClick={onClose}
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

ErrorLimitModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    maxAllowed: PropTypes.number,
    onClose: PropTypes.func.isRequired,
    onAction: PropTypes.func.isRequired,
};

export default ErrorLimitModal;