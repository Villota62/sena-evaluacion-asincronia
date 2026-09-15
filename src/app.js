import readline from 'readline';
// Importamos todo el contenido del barril como un objeto único
import * as apiModules from './index.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  let continueRunning = true;

  while (continueRunning) {
    console.clear();
    console.log('==================================================');
    console.log('    EVALUACIÓN PRÁCTICA - ASINCRONÍA EN JS       ');
    console.log('==================================================');
    console.log('1. Listar tareas pendientes por usuario');
    console.log('2. Buscar usuario, sus álbumes y fotos (por username)');
    console.log('3. Filtrar posts por nombre o título y ver comentarios');
    console.log('4. Obtener usuarios con nombre y teléfono');
    console.log('5. Estructura completa: Usuarios, Posts, Comentarios y Álbumes');
    console.log('0. Salir');
    console.log('--------------------------------------------------');

    const option = (await askQuestion('Seleccione el número del ejercicio a ejecutar: ')).trim();

    try {
      // Seleccionamos directamente la función pública exportada por el barril
      const getPendingFn = apiModules.getPendingTasks;

      switch (option) {
      case '1': {
        console.log('\n--- Ejecutando Ejercicio 1 ---');
        const tasks = await getPendingFn();
        console.dir(tasks, { depth: null, colors: true });
        break;
      }
      case '2': {
        const username = await askQuestion('\nIngrese el username del usuario a buscar (ej. Bret): ');
        console.log('\n--- Consultando información ---');
        const userData = await apiModules.getUserAlbumsAndPhotos(username);
        console.dir(userData, { depth: null, colors: true });
        break;
      }
      case '3': {
        const titleQuery = await askQuestion('\nIngrese el nombre o una palabra del título del post: ');
        console.log('\n--- Consultando posts y comentarios ---');
        const commentsData = await apiModules.getPostsByTitleWithComments(titleQuery);
        console.dir(commentsData, { depth: null, colors: true });
        break;
      }
      case '4': {
        console.log('\n--- Ejecutando Ejercicio 4 ---');
        const mappedUsers = await apiModules.getMappedUsers();
        console.dir(mappedUsers, { depth: null, colors: true });
        break;
      }
      case '5': {
        console.log('\n--- Consultando la estructura completa del Ejercicio 5 ---');
        const enriched = await apiModules.getEnrichedUsers();
        console.dir(enriched, { depth: null, colors: true });
        break;
      }
      case '0':
        console.log('\n¡Hasta luego!');
        continueRunning = false;
        rl.close();
        break;
      default:
        console.log('\nOpción no válida. Intente nuevamente.');
        break;
      }
    } catch (error) {
      console.error('\nError al ejecutar la opción:', error.message);
    }

    if (continueRunning) {
      await askQuestion('\nPresione ENTER para volver al menú...');
    }
  }
}

main();