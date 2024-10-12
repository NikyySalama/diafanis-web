const { test, expect } = require('@playwright/test');

//Controlar que no se pueda editar una eleccion pasada de la fecha
/*test('no se puede editar la elección pasada la fecha de inicio', async ({ page }) => {
    // Simula que el usuario ya está autenticado (puedes ajustar esto según cómo manejes la autenticación)
    await page.context().addCookies([
      { name: 'jwt', value: 'your_token_value', domain: 'localhost', path: '/' },
      { name: 'user', value: 'user_id_value', domain: 'localhost', path: '/' }
    ]);
  
    // Navega a la página de elecciones del usuario
    await page.goto('http://localhost:3000/userElections');
  
    // Espera a que se cargue la tabla de elecciones
    await page.waitForSelector('table');
  
    // Encuentra una fila de elección que ya haya pasado su fecha de inicio
    const row = await page.locator('table tr').filter({
      hasText: 'Fecha de Inicio Pasada'
    });
  
    // Intenta hacer clic en la fila (simulando el intento de edición)
    await row.click();
  
    // Verifica que la funcionalidad de edición esté deshabilitada (puedes ajustar esto según cómo sea la UI)
    const editButton = page.locator('text=Editar');
    await expect(editButton).toBeDisabled();
  
    // También puedes verificar que aparece un mensaje indicando que la elección no es editable
    const errorMessage = page.locator('text=La elección no se puede editar después de la fecha de inicio');
    await expect(errorMessage).toBeVisible();
  });*/