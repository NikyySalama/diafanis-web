export const fetchParties = async (electionId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}/parties`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error('Error al obtener los partidos');
            return [];
        }
    } catch (error) {
        console.error('Error en la solicitud de partidos', error);
        return [];
    }
};

export const fetchFormulas = async (electionId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}/electionPositions`);
        if (response.ok) {
            const positions = await response.json();
            return positions.flatMap(position =>
                position.formulas.map(formula => ({
                    title: position.title,
                    idNumber: formula.idNumber,
                    partyUuid: formula.party.uuid,
                    partyName: formula.party.name,
                    candidates: formula.candidates,
                    uuid: formula.uuid,
                }))
            );
        } else {
            throw new Error('Error al obtener las posiciones');
        }
    } catch (error) {
        console.error('Error en fetchFormulas:', error);
        return [];
    }
};

export const fetchPositions = async (electionId) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/elections/${electionId}/electionPositions`);
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error en fetchPositions:', error);
        return [];
    }
};  