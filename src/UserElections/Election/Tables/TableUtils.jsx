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

export const postTable = async (table, electionId) => {
    const location = {
      country: table.country,
      state: table.state,
      city: table.city,
      address: table.address
    };
    const tableToSend = {
      idNumber: table.id,
      electionUuid: electionId,
      location: location
    };
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tables`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
        },
        body: JSON.stringify(tableToSend)
      });
      if (response.ok) {
        const savedTable = await response.json();
        console.log('Mesa guardada:', savedTable);
        return true;
      } else {
        console.error('Error al guardar la mesa:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      return false;
    }
  };