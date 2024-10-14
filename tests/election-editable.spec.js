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
});

test.afterEach(async () => {
    if (context) await context.close();
});

test.describe('Testing Election Editable', () => {
    test('Testeo de edicion de eleccion habilitada', async () => {
        await page.goto('http://localhost:3000/userElections');

        await page.waitForSelector('text=Eleccion Test Editable', { timeout: 20000 });
        await page.click('text=Eleccion Test Editable');

        await page.waitForSelector('[aria-label="edit"]', { timeout: 20000 });
        await page.click('[aria-label="edit"]');

        await page.waitForSelector('[aria-label="Close"]', { timeout: 20000 });
        await page.click('[aria-label="Close"]');
    });

    test('Testeo de edicion de una mesa habilitado', async () => {
        await page.goto('http://localhost:3000/userElections');

        await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
        await page.click('text=Eleccion Test No Editable');

        await page.waitForSelector('text=Mesas', { timeout: 20000 });
        await page.click('text=Mesas');

        await page.waitForSelector('text=Rawson', { timeout: 20000 });
        await page.click('text=Rawson');

        await page.waitForSelector('text=Editar', { timeout: 20000 });
        await page.click('text=Editar');

        await page.waitForSelector('text=Ver Mesa', { timeout: 20000 });

        await page.waitForSelector('[aria-label="Close"]', { timeout: 20000 });
        await page.click('[aria-label="Close"]');
    });

    test('Testeo de edicion de un partido habilitado', async () => {
        await page.goto('http://localhost:3000/userElections');

        await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
        await page.click('text=Eleccion Test No Editable');

        await page.waitForSelector('text=Partidos', { timeout: 20000 });
        await page.click('text=Partidos');

        await page.waitForSelector('text=La Libertad Avanza', { timeout: 20000 });
        await page.click('text=La Libertad Avanza');

        await page.waitForSelector('text=Editar', { timeout: 20000 });
        await page.click('text=Editar');

        await page.waitForSelector('text=Detalles del Partido', { timeout: 20000 });

        await page.waitForSelector('[aria-label="Close"]', { timeout: 20000 });
        await page.click('[aria-label="Close"]');
    });

    test('Testeo de edicion de una formula habilitada', async () => {
        await page.goto('http://localhost:3000/userElections');

        await page.waitForSelector('text=Eleccion Test No Editable', { timeout: 20000 });
        await page.click('text=Eleccion Test No Editable');

        await page.waitForSelector('text=Formulas', { timeout: 20000 });
        await page.click('text=Formulas');

        await page.waitForSelector('text=La Libertad Avanza', { timeout: 20000 });
        await page.click('text=La Libertad Avanza');

        await page.waitForSelector('text=Editar', { timeout: 20000 });
        await page.click('text=Editar');

        await page.waitForSelector('text=Información de Fórmula', { timeout: 20000 });

        await page.waitForSelector('[aria-label="Close"]', { timeout: 20000 });
        await page.click('[aria-label="Close"]');
    });
});