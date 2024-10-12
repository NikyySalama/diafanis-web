const { test, expect } = require('@playwright/test');
//TODO: crear un usuario previamente para poder obtener el sessionStorage
test('Crear elección a través de la API y verificar en la UI', async ({ page, request }) => {
    // Enviar una solicitud POST para crear la elección directamente
    
    const response = await request.post('http://localhost:3000/api/elections', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${sessionStorage.getItem('jwt')}`,
        },
        body: JSON.stringify({
            name: 'Elección 2024',
            description: 'Elección presidencial 2024',
            startDate: '2024-10-01',
            endDate: '2024-11-01'
        })
    });

    console.log('Status:', response.status());
    const responseBody = await response.json();
    console.log('Response Body:', responseBody);

    // Verificar que la respuesta fue exitosa
    expect(response.ok()).toBeTruthy();

    const responseData = await response.json();
    const electionUUID = responseData.uuid;

    const electionsResponse = await request.get(`http://localhost:3000/api/elections/${electionUUID}`);
    expect(electionsResponse.ok()).toBeTruthy();

    const createdElection = await electionsResponse.json();

    // Verificar que los datos de la elección coincidan
    expect(createdElection).toBeTruthy();
    expect(createdElection.name).toBe('Elección 2024');
    expect(createdElection.startDate).toBe('2024-10-01');
    expect(createdElection.endDate).toBe('2024-11-01');
});