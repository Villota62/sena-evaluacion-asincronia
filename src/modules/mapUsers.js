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

    // Transformamos los datos para conservar únicamente el nombre y el teléfono
    const mappedUsers = users.map(user => Object.freeze({
      name: user.name,
      phone: user.phone
    }));

    // Retornamos el arreglo inmutable con los usuarios mapeados
    return Object.freeze(mappedUsers);

  } catch (error) {
    console.error('[Error en getMappedUsers]:', error.message);
    throw error;
  }
}