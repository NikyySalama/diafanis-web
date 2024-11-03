import React, { useState, useEffect } from "react";
import '../CSS/HeadContent.css';
import Typography from '@mui/material/Typography';

const HeadContent = ({ scrollContainerRef }) => {
    const [padding, setPadding] = useState(100); // En px para mayor control

    useEffect(() => {
        const handleScroll = () => {
            // Calcular el nuevo padding basado en el scroll
            const newPadding = Math.max(10, 100 - scrollContainerRef.current.scrollTop * 0.3);
            // Actualizamos el padding solo si cambia
            if (newPadding !== padding) {
                setPadding(newPadding);
            }
        };

        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [padding, scrollContainerRef]);

    return (
        <div
            className="HeadContent"
            style={{
                backgroundColor: '#020246',
                paddingTop: `calc(${padding}px + var(--navbar-height))`,
                paddingBottom: `${padding}px`,
                transition: "padding 0.1s ease-out"
            }}
        >
            <Typography className="HeadContent-title h1" color="back" variant="h3">
                Bienvenido a Diafanis
            </Typography>
            <Typography className="HeadContent-text h4" color="back" variant="h6">
                Su sistema de votación de confianza
            </Typography>
        </div>
    );
};

export default HeadContent;