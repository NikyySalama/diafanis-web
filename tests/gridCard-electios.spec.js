const { test, expect } = require('@playwright/test');
//TODO: crear un usuario previamente para poder obtener el sessionStorage
test('Crear elección a través de la API y verificar en la UI', async ({ page, request }) => {
    // Enviar una solicitud POST para crear la elección directamente
    
    await page.route('**/api/elections', async (route) => {
        const mockData = [
          { uuid: '1', title: 'Election 1', imageUrl: '' },
          { uuid: '2', title: 'Election 2', imageUrl: '' },
        ];
        // Respond with the mock data
        await route.fulfill({
          contentType: 'application/json',
          body: JSON.stringify(mockData),
        });
      });
    
    await page.goto('http://localhost:3000');
    await page.waitForSelector('.grid-container');

  // Verify that the mocked data is displayed
  const cards = await page.locator('.grid > div'); // Adjust the selector to match the structure of Card components
  expect(await cards.count()).toBe(2); // Expect 2 cards to be rendered

  // Verify the content of the cards
  expect(await cards.nth(0).locator('h4').textContent()).toBe('Election 1'); // Check title for the first card
  expect(await cards.nth(1).locator('h4').textContent()).toBe('Election 2'); // Check title for the second card
});
