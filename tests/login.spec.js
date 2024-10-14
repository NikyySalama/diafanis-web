const { test } = require('@playwright/test');

test('Guardar estado de sesión', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="username"]', 'usuarioTest');
  await page.fill('input[name="password"]', 'contraseñaTest');
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3000/userElections');

  // Guardar el estado de sesión en un archivo JSON
  await page.context().storageState({ path: 'storageState.json' });
});
