export const addAuthorities = async (electionId, selectedTable, authoritiesData) => {
    try {
        const updatedAuthoritiesData = authoritiesData.map(authority => ({
            ...authority,
            docType: 'DNI',
            electorTableUuid: selectedTable,
            electionUuid: electionId
        }));

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tables/${selectedTable}/authorities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
            },
            body: JSON.stringify(updatedAuthoritiesData),
        });

        if (response.ok) {
            return true;
        } else {
            console.error('Error al subir las autoridades', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error en la solicitud de autoridades', error);
        return false;
    }
};