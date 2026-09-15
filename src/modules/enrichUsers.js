// Exportamos la función asíncrona para obtener usuarios enriquecidos con sus publicaciones y tareas
export async function getEnrichedUsers() {
  try {
    const BASE_URL = 'https://jsonplaceholder.typicode.com';

    // 1. Realizamos las peticiones en paralelo para optimizar el rendimiento
    const [usersRes, postsRes, todosRes] = await Promise.all([
      fetch(`${BASE_URL}/users`),
      fetch(`${BASE_URL}/posts`),
      fetch(`${BASE_URL}/todos`)
    ]);

    if (!usersRes.ok || !postsRes.ok || !todosRes.ok) {
      throw new Error('Error al consultar los recursos de usuarios, posts o todos.');
    }

    const [users, posts, todos] = await Promise.all([
      usersRes.json(),
      postsRes.json(),
      todosRes.json()
    ]);

    // 2. Combinamos la información relacionando cada usuario por su id
    const enrichedUsers = users.map(user => {
      const userPosts = posts.filter(post => post.userId === user.id);
      const userTodos = todos.filter(todo => todo.userId === user.id);

      return Object.freeze({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        totalPosts: userPosts.length,
        posts: userPosts.map(post => ({
          id: post.id,
          title: post.title,
          body: post.body
        })),
        totalTodos: userTodos.length,
        todos: userTodos.map(todo => ({
          id: todo.id,
          title: todo.title,
          completed: todo.completed
        }))
      });
    });

    return Object.freeze(enrichedUsers);

  } catch (error) {
    console.error('[Error en getEnrichedUsers]:', error.message);
    throw error;
  }
}