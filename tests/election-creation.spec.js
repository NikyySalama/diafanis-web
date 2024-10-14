const { test, expect } = require('@playwright/test');

let context;
let page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();

  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
    sessionStorage.setItem('jwt', 'token');
    sessionStorage.setItem('user', 'Nicole');
  });
});

test.afterAll(async () => {
  await context.close();
});

test.describe('Testing Form', () => {
  test.beforeEach(async () => {
    await page.goto('http://localhost:3000/userElections');
    await page.waitForSelector('button[aria-label="Crear Eleccion"]'); // Ensure the button is loaded
    await page.click('button[aria-label="Crear Eleccion"]');
  });

  test('Debería mostrar una alerta si las fechas son incorrectas', async () => {
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toBe('La fecha de fin debe ser posterior a la fecha de inicio.');
      await dialog.dismiss();
    });

    await page.fill('#title', 'Elección Test');
    await page.fill('#startsAt', '2024-10-14T10:00');
    await page.fill('#endsAt', '2024-10-14T09:00');

    await page.click('button[type="submit"]');
  });
});