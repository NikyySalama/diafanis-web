const { test, expect } = require('@playwright/test');

// Cargar el estado de sesión al inicio
test.use({ storageState: 'storageState.json' });

test.describe('Testing Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/userElections');
    await page.click('button:has(svg)');  // Click en el botón con ícono
  });

  test('Debería mostrar una alerta si las fechas son incorrectas', async ({ page }) => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('La fecha de fin debe ser posterior a la fecha de inicio.');
      await dialog.dismiss();
    });

    await page.fill('input[placeholder="Título"]', 'Elección Test');
    await page.fill('input[type="datetime-local"]:nth-of-type(1)', '2024-10-14T10:00');
    await page.fill('input[type="datetime-local"]:nth-of-type(2)', '2024-10-14T09:00'); // Fecha incorrecta

    await page.click('button[type="submit"]');
  });
});