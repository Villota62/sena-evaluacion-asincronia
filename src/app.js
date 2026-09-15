import readline from 'readline';
// Importamos todo el contenido del barril como un objeto único
import * as apiModules from './index.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.clear();
  console.log('==================================================');
  console.log('    EVALUACIÓN PRÁCTICA - ASINCRONÍA EN JS       ');
  console.log('==================================================');
  console.log('1. Listar tareas pendientes por usuario');
  console.log('2. Buscar usuario, sus álbumes y fotos (por username)');
  console.log('3. Filtrar posts por ID o correo y ver comentarios');
  console.log('4. Obtener usuarios mapeados');
  console.log('5. Estructura completa: Usuarios, Posts, Comentarios y Álbumes');
  console.log('0. Salir');
  console.log('--------------------------------------------------');

  const option = await askQuestion('Seleccione el número del ejercicio a ejecutar: ');

  // Detectar automáticamente la función de tareas pendientes sin importar su nombre
  const getPendingFn = apiModules.getPendingTasksGroupedByUser || apiModules.getPendingTasks || Object.values(apiModules)[0];

  try {
    switch (option.trim()) {
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
        const input = await askQuestion('\nIngrese el ID de la publicación (ej. 1) o un correo: ');
        console.log('\n--- Consultando comentarios ---');
        const criteria = isNaN(input) ? { email: input } : { postId: Number(input) };
        const commentsData = await apiModules.getCommentsByPostOrEmail(criteria);
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
        rl.close();
        return;
      default:
        console.log('\nOpción no válida. Intente nuevamente.');
    }
  } catch (error) {
    console.error('\nError al ejecutar la opción:', error.message);
  }

  await askQuestion('\nPresione ENTER para volver al menú...');
  main();
}

main();