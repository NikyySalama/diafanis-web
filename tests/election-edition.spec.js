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

    await page.waitForTimeout(5000);
});

test.afterAll(async () => {
    await context.close();
});

test('No se puede editar una elección si la fecha de inicio ha pasado', async ({ page }) => {
  await page.route('**/api/users/**', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        elections: [
          {
            title: 'Elección pasada',
            description: 'Una elección cuyo inicio ya ha pasado',
            startsAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // Hace 2 días
            endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // En 2 días
            uuid: '123',
          },
        ],
      }),
    });
  });

  await page.goto('http://localhost:3000/userElections');

  const electionRow = await page.getByText('Elección pasada');
  await expect(electionRow).toBeVisible({ timeout: 10000 });

  await electionRow.click();

  const state = await page.evaluate(() => window.history.state);
  expect(state.electionEditable).toBe(false);
});