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

test.describe('Testing Election Not Editable', () => {
  test('No se puede editar una elección si la fecha de inicio ha pasado', async ({}, testInfo) => {
    const page = testInfo.page;

    await page.goto('http://localhost:3000/userElections');

    await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });

    await page.click('text=Eleccion Test No Editable');

    await page.waitForSelector('[aria-label="edit"]', { timeout: 20000 });
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('La eleccion ya no es editable.');
        await dialog.accept();
    });
    await page.click('[aria-label="edit"]');
  });

  test('No se puede editar una mesa si la fecha de inicio de la eleccion ha pasado', async ({}, testInfo) => {
    const page = testInfo.page;
    await page.goto('http://localhost:3000/userElections');

    await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
    await page.click('text=Eleccion Test No Editable');

    await page.waitForSelector('text=Mesas', { timeout: 20000 });
    await page.click('text=Mesas');

    await page.waitForSelector('text=Rawson', { timeout: 20000 });
    await page.click('text=Rawson');

    await page.waitForSelector('text=Editar', { timeout: 20000 });
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('La eleccion ya no es editable.');
      await dialog.accept();
    });
    await page.click('text=Editar');
  });

  test('No se puede editar un partido si la fecha de inicio de la eleccion ha pasado', async ({}, testInfo) => {
    const page = testInfo.page;
    await page.goto('http://localhost:3000/userElections');

    await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
    await page.click('text=Eleccion Test No Editable');

    await page.waitForSelector('text=Partidos', { timeout: 20000 });
    await page.click('text=Partidos');

    await page.waitForSelector('text=La Libertad Avanza', { timeout: 20000 });
    await page.click('text=La Libertad Avanza');

    await page.waitForSelector('text=Editar', { timeout: 20000 });
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('La eleccion ya no es editable.');
      await dialog.accept();
    });
    await page.click('text=Editar');

  });

  test('No se puede editar una formula si la fecha de inicio de la eleccion ha pasado', async ({}, testInfo) => {
    const page = testInfo.page;
    await page.goto('http://localhost:3000/userElections');

    await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
    await page.click('text=Eleccion Test No Editable');

    await page.waitForSelector('text=Formulas', { timeout: 20000 });
    await page.click('text=Formulas');

    await page.waitForSelector('text=La Libertad Avanza', { timeout: 20000 });
    await page.click('text=La Libertad Avanza');

    await page.waitForSelector('text=Editar', { timeout: 20000 });
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('La eleccion ya no es editable.');
      await dialog.accept();
    });
    await page.click('text=Editar');
  });
});