// Exportamos la función asíncrona para obtener comentarios por post o por correo de usuario
export async function getCommentsByPostOrEmail(criteria) {
  try {
    // Validamos que se proporcione un objeto con criterios de búsqueda
    if (!criteria || typeof criteria !== 'object') {
      throw new Error('Debe proporcionar un objeto de criterio válido ({ postId } o { email }).');
    }

    const { postId, email } = criteria;
    const BASE_URL = 'https://jsonplaceholder.typicode.com';

    // Caso 1: Búsqueda por postId
    if (postId !== undefined) {
      if (typeof postId !== 'number' || postId <= 0) {
        throw new Error('El parámetro postId debe ser un número entero positivo.');
      }

      // Verificamos si la publicación existe
      const postResponse = await fetch(`${BASE_URL}/posts/${postId}`);
      if (postResponse.status === 404) {
        throw new Error(`La publicación con postId ${postId} no existe.`);
      }
      if (!postResponse.ok) {
        throw new Error('Error al verificar la existencia de la publicación.');
      }

      const post = await postResponse.json();

      // Consultamos los comentarios asociados a la publicación
      const commentsResponse = await fetch(`${BASE_URL}/posts/${postId}/comments`);
      if (!commentsResponse.ok) {
        throw new Error('Error al obtener los comentarios de la publicación.');
      }

      const comments = await commentsResponse.json();

      return {
        queryType: 'postId',
        postId: post.id,
        postTitle: post.title,
        totalComments: comments.length,
        comments: comments.map(comment => ({
          id: comment.id,
          name: comment.name,
          email: comment.email,
          body: comment.body
        }))
      };
    }

    // Caso 2: Búsqueda por correo electrónico (email)
    if (email !== undefined) {
      if (typeof email !== 'string' || !email.trim()) {
        throw new Error('El parámetro email debe ser una cadena de texto válida.');
      }

      // Filtramos la lista global de comentarios por el email ingresado
      const response = await fetch(`${BASE_URL}/comments?email=${encodeURIComponent(email.trim())}`);
      if (!response.ok) {
        throw new Error('Error al consultar los comentarios por correo electrónico.');
      }

      const comments = await response.json();

      if (comments.length === 0) {
        throw new Error(`No se encontraron comentarios asociados al correo: "${email}"`);
      }

      return {
        queryType: 'email',
        email: email.trim(),
        totalComments: comments.length,
        comments: comments.map(comment => ({
          id: comment.id,
          postId: comment.postId,
          name: comment.name,
          body: comment.body
        }))
      };
    }

    // Si el objeto no incluye postId ni email
    throw new Error('Debe especificar al menos un criterio de búsqueda: "postId" o "email".');

  } catch (error) {
    console.error('[Error en getCommentsByPostOrEmail]:', error.message);
    throw error;
  }
}