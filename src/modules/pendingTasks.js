// Exportamos la función asíncrona para que pueda ser consumida desde el archivo barril
export async function getPendingTasks() {
  try {
    // Definimos las URLs de los endpoints requeridos de JSONPlaceholder
    const USERS_URL = 'https://jsonplaceholder.typicode.com/users';
    const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos';

    // Realizamos las peticiones HTTP en paralelo con Promise.all para optimizar el rendimiento
    const [usersResponse, todosResponse] = await Promise.all([
      fetch(USERS_URL),
      fetch(TODOS_URL)
    ]);

    // Validamos que ambas peticiones hayan respondido con un estado HTTP exitoso (200-299)
    if (!usersResponse.ok || !todosResponse.ok) {
      throw new Error('Error al obtener los datos de la API pública.');
    }

    // Transformamos las respuestas en formato JSON a objetos y arreglos JavaScript
    const users = await usersResponse.json();
    const todos = await todosResponse.json();

    // Mapeamos el arreglo de usuarios para estructurar la respuesta inmutable
    const result = users.map(user => {
      // Filtramos la lista general de tareas buscando únicamente las pertenecientes al usuario actual
      // y cuya propiedad completed sea false (tareas pendientes)
      const pending = todos.filter(todo => todo.userId === user.id && !todo.completed);

      // Retornamos la estructura enriquecida por cada usuario
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        pendingTasksCount: pending.length,
        pendingTasks: pending.map(task => ({
          id: task.id,
          title: task.title
        }))
      };
    });

    // Retornamos el resultado final con los datos procesados
    return result;

  } catch (error) {
    // Capturamos cualquier fallo de red o parsing sin bloquear la ejecución global
    console.error('[Error en getPendingTasks]:', error.message);
    throw error;
  }
}