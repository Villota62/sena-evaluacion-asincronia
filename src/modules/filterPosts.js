// Exportamos la función asíncrona para filtrar publicaciones por título y agregar comentarios
export async function getPostsByTitleWithComments(titleQuery) {
  try {
    // Validamos que el texto recibido sea una cadena con contenido útil
    if (typeof titleQuery !== 'string' || !titleQuery.trim()) {
      throw new Error('Debe proporcionar un nombre o fragmento del título del post.');
    }

    // Consultamos todos los posts porque el filtro solicitado corresponde a su título
    const BASE_URL = 'https://jsonplaceholder.typicode.com';
    const postsResponse = await fetch(`${BASE_URL}/posts`);
    if (!postsResponse.ok) {
      throw new Error(`Error al consultar los posts. Estado HTTP: ${postsResponse.status}`);
    }

    const posts = await postsResponse.json();
    const normalizedQuery = titleQuery.trim().toLowerCase();
    const matchingPosts = posts.filter(post => post.title.toLowerCase().includes(normalizedQuery));

    // Consultamos en paralelo los comentarios de cada publicación encontrada
    const postsWithComments = await Promise.all(matchingPosts.map(async post => {
      const commentsResponse = await fetch(`${BASE_URL}/posts/${post.id}/comments`);
      if (!commentsResponse.ok) {
        throw new Error(`Error al obtener comentarios del post ${post.id}.`);
      }

      const comments = await commentsResponse.json();
      return {
        id: post.id,
        userId: post.userId,
        title: post.title,
        body: post.body,
        comments
      };
    }));

    return postsWithComments;

  } catch (error) {
    console.error('[Error en getPostsByTitleWithComments]:', error.message);
    throw error;
  }
}