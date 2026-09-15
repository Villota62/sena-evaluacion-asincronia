// Exportamos la función asíncrona para consultar usuario, sus álbumes y sus fotos
export async function getUserAlbumsAndPhotos(username) {
  try {
    // Validamos que el parámetro de entrada sea un string válido y no esté vacío
    if (!username || typeof username !== 'string') {
      throw new Error('Debe proporcionar un nombre de usuario (username) válido.');
    }

    // Definimos la URL base para las peticiones a la API
    const BASE_URL = 'https://jsonplaceholder.typicode.com';

    // 1. Buscamos el usuario por su username utilizando query params
    const userResponse = await fetch(`${BASE_URL}/users?username=${encodeURIComponent(username)}`);
    if (!userResponse.ok) throw new Error('Error al conectar con el servicio de usuarios.');

    const users = await userResponse.json();
    
    // Verificamos si la API devolvió algún usuario con ese username
    if (users.length === 0) {
      throw new Error(`No se encontró ningún usuario con el username: "${username}"`);
    }

    const user = users[0]; // Extraemos el usuario encontrado

    // 2. Consultamos los álbumes y fotos en paralelo para optimizar tiempos
    const [albumsResponse, photosResponse] = await Promise.all([
      fetch(`${BASE_URL}/albums?userId=${user.id}`),
      fetch(`${BASE_URL}/photos`)
    ]);

    if (!albumsResponse.ok || !photosResponse.ok) {
      throw new Error('Error al obtener los álbumes o fotografías del usuario.');
    }

    const albums = await albumsResponse.json();
    const photos = await photosResponse.json();

    // 3. Estructuramos la información combinando cada álbum con sus fotos correspondientes
    const albumsWithPhotos = albums.map(album => {
      // Filtramos la lista global de fotos según el albumId
      const albumPhotos = photos.filter(photo => photo.albumId === album.id);

      return {
        albumId: album.id,
        title: album.title,
        photosCount: albumPhotos.length,
        photos: albumPhotos.map(photo => ({
          id: photo.id,
          title: photo.title,
          url: photo.url,
          thumbnailUrl: photo.thumbnailUrl
        }))
      };
    });

    // Devolvemos el objeto inmutable con los detalles requeridos
    return {
      userId: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      totalAlbums: albumsWithPhotos.length,
      albums: albumsWithPhotos
    };

  } catch (error) {
    // Captura centralizada de errores para prevenir fallos globales
    console.error('[Error en getUserAlbumsAndPhotos]:', error.message);
    throw error;
  }
}