// Exportamos la función asíncrona para obtener la estructura completa del Ejercicio 5
export async function getEnrichedUsers() {
  try {
    const BASE_URL = 'https://jsonplaceholder.typicode.com';

    // 1. Petición en paralelo de todos los recursos requeridos por el PDF
    const [usersRes, postsRes, commentsRes, albumsRes, photosRes] = await Promise.all([
      fetch(`${BASE_URL}/users`),
      fetch(`${BASE_URL}/posts`),
      fetch(`${BASE_URL}/comments`),
      fetch(`${BASE_URL}/albums`),
      fetch(`${BASE_URL}/photos`)
    ]);

    if (!usersRes.ok || !postsRes.ok || !commentsRes.ok || !albumsRes.ok || !photosRes.ok) {
      throw new Error('Error al consultar uno o más recursos de la API.');
    }

    const [users, posts, comments, albums, photos] = await Promise.all([
      usersRes.json(),
      postsRes.json(),
      commentsRes.json(),
      albumsRes.json(),
      photosRes.json()
    ]);

    // 2. Anidación completa relacional exigida en la guía:
    // Usuarios -> Posts -> Comentarios | Usuarios -> Álbumes -> Fotos
    const fullEnrichedUsers = users.map(user => {
      // Filtrar posts del usuario y asociar comentarios a cada post
      const userPosts = posts
        .filter(post => post.userId === user.id)
        .map(post => ({
          id: post.id,
          title: post.title,
          body: post.body,
          comments: comments
            .filter(comment => comment.postId === post.id)
            .map(comment => ({
              id: comment.id,
              name: comment.name,
              email: comment.email,
              body: comment.body
            }))
        }));

      // Filtrar álbumes del usuario y asociar fotos a cada álbum
      const userAlbums = albums
        .filter(album => album.userId === user.id)
        .map(album => ({
          id: album.id,
          title: album.title,
          photos: photos
            .filter(photo => photo.albumId === album.id)
            .map(photo => ({
              id: photo.id,
              title: photo.title,
              url: photo.url,
              thumbnailUrl: photo.thumbnailUrl
            }))
        }));

      return Object.freeze({
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        phone: user.phone,
        totalPosts: userPosts.length,
        posts: userPosts,
        totalAlbums: userAlbums.length,
        albums: userAlbums
      });
    });

    return Object.freeze(fullEnrichedUsers);

  } catch (error) {
    console.error('[Error en getEnrichedUsers]:', error.message);
    throw error;
  }
}