
import checkIMGByURL from "../../../Common/validatorURL";
import sanitizeInput from "../../../Common/validatorInput";

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

export const handleAddParty = async (newParty, electionId, setErrorModalData) => {
    const partyData = {
        logoUrl: checkIMGByURL(newParty.logoUrl) ? newParty.logoUrl : "",
        colorHex: sanitizeInput(newParty.colorHex),
        name: sanitizeInput(newParty.name),
        electionUuid: electionId
    };

    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/parties`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
            },
            body: JSON.stringify(partyData)
        });

        if (response.ok) {
            await response.json();
            return true;
        } else {
            const errorBody = await response.json().catch(() => null);
            console.error('Error al guardar el partido:', {
                status: response.status,
                statusText: response.statusText,
                errorBody, // Podría ser un mensaje JSON del servidor
            });
            if(errorBody.message === "El número total de partidos excede el límite permitido."){
                setErrorModalData({
                    isOpen: true,
                    message: errorBody.message,
                    maxAllowed: errorBody.maxAllowed || 'No especificado',
                });
            }
            return false;
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        return false;
    }
};

export const handleDeletePartiesUtils = async (parties, electionId) => {
    try {
        await Promise.all(
            parties.map(async (party) => {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/parties/${party}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${sessionStorage.getItem('jwt')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error en la respuesta del servidor: ${response.status}`);
                }
            })
        );
        const updatedParties = await fetchParties(electionId);
        return updatedParties;
    } catch (error) {
        console.error('Error al eliminar partidos', error);
        return [];
    }
};