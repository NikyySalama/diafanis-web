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

test.describe('Testing Election Content', () => {
    test('Testeo de eleccion info', async () => {
        await page.goto('http://localhost:3000/userElections');
        
        await page.waitForSelector('text=Eleccion Test Editable', { timeout: 20000 });
        await page.click('text=Eleccion Test Editable');

        await page.waitForSelector('text=Título', { timeout: 20000 });
        await page.waitForSelector('text=Eleccion Test Editable', { timeout: 20000 });
        
        await page.waitForSelector('text=Descripción', { timeout: 20000 });
        await page.waitForSelector('text=Descripcion Prueba', { timeout: 20000 });
        
        await page.waitForSelector('text=Comienza', { timeout: 20000 });
        await page.waitForSelector('text=2024-10-30T18:15:00', { timeout: 20000 });
        
        await page.waitForSelector('text=Termina', { timeout: 20000 });
        await page.waitForSelector('text=2024-11-02T18:15:00', { timeout: 20000 });       
    });

    test('Testeo de autoridades de mesa informacion inicial', async () => {
        await page.goto('http://localhost:3000/userElections');
        
        await page.waitForSelector('text=Eleccion Test Editable', { timeout: 20000 });
        await page.click('text=Eleccion Test Editable');

        await page.waitForSelector('text=Autoridades', { timeout: 20000 });
        await page.click('text=Autoridades');
        
        const firstRow = await page.locator('table tr:nth-child(1)');
        await expect(firstRow.locator('td:nth-child(1)')).toHaveText('1');
        await expect(firstRow.locator('td:nth-child(2)')).toHaveText('Capital');
        await expect(firstRow.locator('td:nth-child(3)')).toHaveText('Av Rivadavia 200');
        await expect(firstRow.locator('td:nth-child(4)')).toHaveText('0');

        const secondRow = await page.locator('table tr:nth-child(2)');
        await expect(secondRow.locator('td:nth-child(1)')).toHaveText('2');
        await expect(secondRow.locator('td:nth-child(2)')).toHaveText('Rawson');
        await expect(secondRow.locator('td:nth-child(3)')).toHaveText('Cordoba 123');
        await expect(secondRow.locator('td:nth-child(4)')).toHaveText('0');
    });

    test('Testeo de autoridades de mesa informacion de una mesa', async () => {
        await page.goto('http://localhost:3000/userElections');
        
        await page.waitForSelector('text=Eleccion Test Editable', { timeout: 20000 });
        await page.click('text=Eleccion Test Editable');

        await page.waitForSelector('text=Autoridades', { timeout: 20000 });
        await page.click('text=Autoridades');
        
        const expandLessIcon = await page.locator('[aria-label="expand row"]').first();
    
        await expect(expandLessIcon).toBeVisible();
        await expandLessIcon.click();

        await page.waitForSelector('text=No hay autoridades de mesa', { timeout: 20000 });
    });
});