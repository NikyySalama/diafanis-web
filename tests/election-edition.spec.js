const { test, expect } = require('@playwright/test');

let context;
let page;

test.beforeEach(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();

    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
        sessionStorage.setItem('jwt', 'token');
        sessionStorage.setItem('user', 'Nicole');
    });

    await page.waitForTimeout(500);
});

test.afterEach(async () => {
    await context.close();
});

test.describe('Testing Election Not Editable', () => {
  test('No se puede editar una elección si la fecha de inicio ha pasado', async () => {
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

  test('No se puede editar una mesa si la fecha de inicio de la eleccion ha pasado', async () => {
    await page.goto('http://localhost:3000/userElections');

    await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
    await page.click('text=Eleccion Test No Editable');

    await page.waitForSelector('text=Mesas', { timeout: 20000 });
    await page.click('text=Mesas');

    await page.waitForSelector('text=Rawson', { timeout: 20000 });
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('La eleccion ya no es editable.');
      await dialog.accept();
    });
    await page.click('text=Rawson');
  });

  test('No se puede editar un partido si la fecha de inicio de la eleccion ha pasado', async () => {
    await page.goto('http://localhost:3000/userElections');

    await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
    await page.click('text=Eleccion Test No Editable');

    await page.waitForSelector('text=Partidos', { timeout: 20000 });
    await page.click('text=Partidos');

    await page.waitForSelector('text=La Libertad Avanza', { timeout: 20000 });
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('La eleccion ya no es editable.');
      await dialog.accept();
    });
    await page.click('text=La Libertad Avanza');
  });

  test('No se puede editar una formula si la fecha de inicio de la eleccion ha pasado', async () => {
    await page.goto('http://localhost:3000/userElections');

    await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
    await page.click('text=Eleccion Test No Editable');

    await page.waitForSelector('text=Formulas', { timeout: 20000 });
    await page.click('text=Formulas');

    await page.waitForSelector('text=La Libertad Avanza', { timeout: 20000 });
    page.on('dialog', async dialog => {
      expect(dialog.message()).toBe('La eleccion ya no es editable.');
      await dialog.accept();
    });
    await page.click('text=La Libertad Avanza');
  });

  test('No se puede borrar un partido si la fecha de inicio de la eleccion ha pasado', async () => {
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

  test('No se puede borrar una mesa si la fecha de inicio de la eleccion ha pasado', async () => {
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