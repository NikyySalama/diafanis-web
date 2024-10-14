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

test.describe('Testing Election Creation Form', () => {
    test.beforeEach(async () => {
        await page.goto('http://localhost:3000/userElections');
        await page.waitForSelector('button[aria-label="Crear Eleccion"]');
        await page.click('button[aria-label="Crear Eleccion"]');
    });

    test('Debería mostrar una alerta si las fechas son incorrectas', async () => {
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toBe('La fecha de fin debe ser posterior a la fecha de inicio.');
            await dialog.dismiss();
        });

        await page.fill('#title', 'Elección Test');
        await page.fill('#startsAt', '2025-10-14T10:00');
        await page.fill('#endsAt', '2025-10-14T09:00');

        await page.click('button[type="submit"]');
    });

    test('Debería mostrar una alerta si la fecha de inicio es anterior a la actual', async () => {
        page.on('dialog', async (dialog) => {
            expect(dialog.message()).toBe('La fecha y hora de inicio deben ser posteriores a la fecha y hora actual.');
            await dialog.dismiss();
        });

        await page.fill('#title', 'Elección Test');
        await page.fill('#startsAt', '2023-10-14T10:00');
        await page.fill('#endsAt', '2023-10-14T11:00');

        await page.click('button[type="submit"]');
    });
    
    test('Se puede crear una nueva elección', async () => {
        let dialogLaunched = false;
    
        page.on('dialog', async (dialog) => {
            dialogLaunched = true;
            await dialog.dismiss();
        });
    
        await page.fill('#title', 'Nueva Elección');
        await page.fill('#description', 'Descripción de la nueva elección');
        await page.fill('#startsAt', new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().slice(0, 16));
        await page.fill('#endsAt', new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString().slice(0, 16));
    
        await page.click('button[type="submit"]');
    
        expect(dialogLaunched).toBe(false);
    });
});