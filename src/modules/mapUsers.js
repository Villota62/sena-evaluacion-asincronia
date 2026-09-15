// Exportamos la función asíncrona para obtener y mapear la lista simplificada de usuarios
export async function getMappedUsers() {
  try {
    const BASE_URL = 'https://jsonplaceholder.typicode.com';

    // Realizamos la petición HTTP para obtener todos los usuarios
    const response = await fetch(`${BASE_URL}/users`);
    
    if (!response.ok) {
      throw new Error(`Error en la consulta de usuarios. Estado HTTP: ${response.status}`);
    }

    const users = await response.json();

    // Transformamos los datos para extraer únicamente los campos requeridos
    const mappedUsers = users.map(user => Object.freeze({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      city: user.address?.city || 'Sin información',
      companyName: user.company?.name || 'Sin información'
    }));

    // Retornamos el arreglo inmutable con los usuarios mapeados
    return Object.freeze(mappedUsers);

  } catch (error) {
    console.error('[Error en getMappedUsers]:', error.message);
    throw error;
  }
}