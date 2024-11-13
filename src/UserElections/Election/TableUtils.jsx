export const fetchTables = async (electionId, setTableData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}/tables`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            setTableData(data); // Guardar las tablas en el estado proporcionado
            return true; // Éxito
        } else {
            console.error('Error al obtener las mesas', response.statusText);
            return false; // Fallo en la solicitud
        }
    } catch (error) {
        console.error('Error en la solicitud de mesas', error);
        return false; // Error en la solicitud
    }
};