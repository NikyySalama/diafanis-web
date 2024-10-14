const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ browser }, testInfo) => {
  const context = await browser.newContext(); // Contexto aislado
  const page = await context.newPage(); // Página única por test

  await page.goto('http://localhost:3000');
  await page.evaluate(() => {
      sessionStorage.setItem('jwt', 'token');
      sessionStorage.setItem('user', 'Nicole');
  });

  await page.waitForTimeout(500);

  // Almacenar referencias de contexto y página en el estado del test
  testInfo.context = context;
  testInfo.page = page;
});

test.afterEach(async ({}, testInfo) => {
  // Cerrar página y contexto después de cada test
  if (testInfo.context) {
      await testInfo.context.close();
  }
});

test.describe('Testing Election Not Erasable', () => {
  test('No se puede borrar un partido si la fecha de inicio de la eleccion ha pasado', async ({}, testInfo) => {
    const page = testInfo.page;
    await page.goto('http://localhost:3000/userElections');

    await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
    await page.click('text=Eleccion Test No Editable');

    await page.waitForSelector('text=Partidos', { timeout: 20000 });
    await page.click('text=Partidos');

    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.click();

    await page.waitForSelector('[aria-label="Borrar Eleccion"]', { timeout: 20000 });
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('La eleccion ya no es editable.');
      await dialog.accept();
    });
    await page.click('[aria-label="Borrar Eleccion"]');
  });

  test('No se puede borrar una mesa si la fecha de inicio de la eleccion ha pasado', async ({}, testInfo) => {
    const page = testInfo.page;
    await page.goto('http://localhost:3000/userElections');

    await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
    await page.click('text=Eleccion Test No Editable');

    await page.waitForSelector('text=Mesas', { timeout: 20000 });
    await page.click('text=Mesas');

    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await firstCheckbox.click();

    await page.waitForSelector('[aria-label="Borrar Eleccion"]', { timeout: 20000 });
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('La eleccion ya no es editable.');
      await dialog.accept();
    });
    await page.click('[aria-label="Borrar Eleccion"]');
  });
});