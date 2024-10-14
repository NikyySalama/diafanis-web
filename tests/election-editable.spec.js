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

test.describe('Testing Election Editable', () => {
    test('Testeo de edicion de eleccion habilitada', async () => {
        await page.goto('http://localhost:3000/userElections');

        await page.waitForSelector('text=Eleccion Test Editable', { timeout: 20000 });

        await page.click('text=Eleccion Test Editable');

        await page.waitForSelector('[aria-label="edit"]', { timeout: 20000 });
        await page.click('[aria-label="edit"]');

        await page.waitForSelector('[aria-label="Close"]', { timeout: 20000 });
        await page.click('[aria-label="Close"]')
    });
});