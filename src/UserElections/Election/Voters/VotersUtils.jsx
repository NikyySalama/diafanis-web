export const fetchVoters = async (electionId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } else {
            console.error('Error al obtener los votantes', response.statusText);
            return [];
        }
    } catch (error) {
        console.error('Error en la solicitud de votantes', error);
        return [];
    }
};