export const fetchTables = async (electionId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}/tables`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al obtener las mesas', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error en la solicitud de mesas', error);
        return [];
    }
};