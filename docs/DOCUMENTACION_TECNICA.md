 # Documentacion tecnica

## Proposito y ejecucion

Este proyecto consulta `https://jsonplaceholder.typicode.com/` desde Node.js y
resuelve cinco ejercicios de asincronia. Cada caso de uso vive en un modulo de
`src/modules/`. `src/index.js` es el archivo barril y `src/app.js` solamente
importa ese barril para mostrar el menu de terminal.

```text
node src/app.js
```

El programa recibe opciones numericas y usa `readline.question` encapsulado en
una Promesa para solicitar datos sin bloquear el flujo asincrono.

## Modulos y contratos

| Modulo | Funcion | Entrada | Retorno |
|---|---|---|---|
| `pendingTasks.js` | `getPendingTasks()` | Ninguna | `Promise<Array<Object>>` |
| `userAlbums.js` | `getUserAlbumsAndPhotos(username)` | `string` no vacio | `Promise<Object>` |
| `filterPosts.js` | `getPostsByTitleWithComments(titleQuery)` | `string` no vacio | `Promise<Array<Object>>` |
| `mapUsers.js` | `getMappedUsers()` | Ninguna | `Promise<ReadonlyArray<Object>>` |
| `enrichUsers.js` | `getEnrichedUsers()` | Ninguna | `Promise<ReadonlyArray<Object>>` |

Todas las funciones son `async`, por lo tanto siempre retornan una Promesa.
Los errores de red, respuestas HTTP no exitosas, datos inexistentes y entradas
invalidas se convierten en errores controlados mediante `try/catch`. El modulo
captura el error, muestra un mensaje contextual y lo relanza para que `app.js`
pueda informar el fallo sin cerrar abruptamente el programa.

## Ejercicio 1: tareas pendientes

`getPendingTasks` solicita `/users` y `/todos` en paralelo con `Promise.all`.
Luego usa `map` para crear un resultado por usuario y `filter` para conservar
solo tareas cuya propiedad `completed` es `false`. Cada elemento contiene el
identificador, nombre, username, cantidad y lista de tareas pendientes.

Los arreglos recibidos no se modifican. `map` y `filter` crean nuevos arreglos,
por lo que el proceso es inmutable respecto a la respuesta original.

## Ejercicio 2: usuario, albumes y fotos

`username` es un dato de entrada de tipo `string`. Se valida que exista y que
no sea de otro tipo. Se consulta `/users?username=...`; si no hay coincidencias
se informa el caso. Despues se consultan albumes y fotos en paralelo.

Cada album se construye con `map` y recibe solo las fotos cuyo `albumId`
coincide. `encodeURIComponent` evita que caracteres del username alteren la
URL. El retorno es un objeto nuevo con los datos principales del usuario y los
albumes enriquecidos.

## Ejercicio 3: posts por nombre o titulo

`getPostsByTitleWithComments(titleQuery)` recibe un `string` y elimina espacios
externos con `trim`. El texto se normaliza a minusculas para que la busqueda no
dependa de mayusculas. La funcion solicita `/posts`, usa `filter` sobre la
propiedad `title` y conserva los posts cuyo titulo contiene el texto buscado.

Los comentarios de cada coincidencia se consultan en paralelo con
`Promise.all`. El resultado es un arreglo de objetos que conserva `id`,
`userId`, `title`, `body` y agrega `comments`.

## Ejercicio 4: transformacion de usuarios

`getMappedUsers` hace una unica peticion a `/users`. `map` crea un nuevo arreglo
con exactamente dos propiedades por usuario: `name` y `phone`. Cada objeto y
el arreglo final se protegen con `Object.freeze`, demostrando una salida
inmutable para el consumidor.

## Ejercicio 5: enriquecimiento completo

`getEnrichedUsers` realiza una peticion por recurso para `/users`, `/posts`,
`/comments`, `/albums` y `/photos`, todas en paralelo. Despues usa
desestructuracion de arreglos para separar las respuestas y vuelve a usar
`Promise.all` para convertirlas a JSON.

Para cada usuario, `filter` selecciona sus posts y albumes. Cada post recibe
los comentarios con el mismo `postId`; cada album recibe las fotos con el mismo
`albumId`. `map` crea todos los objetos de salida sin mutar los datos de la
API. La salida final y cada usuario se congelan con `Object.freeze`.

## Recursos del lenguaje demostrados

- Variables constantes con `const` para URLs, respuestas y resultados.
- Tipos de entrada: `string`, `number`, objetos de criterios internos y arreglos JSON.
- Condicionales `if`, `switch`, operador `||`, operador ternario y comparacion estricta.
- Operadores logicos `&&`, `||` y `!` para validaciones y filtrado.
- Operadores matematicos mediante `length` para contar resultados y `Number` para conversiones.
- Arreglos, objetos, `map`, `filter`, `Promise.all` y desestructuracion.
- Operador rest/spread: el proyecto no necesita copiar o combinar propiedades con `...`; se prioriza crear objetos explicitos para controlar el contrato de salida.
- Callbacks: `map`, `filter` y `readline.question` reciben funciones callback.
- Promesas explicitas en `askQuestion` y Promesas implicitas de funciones `async`.

## Entrada, salida y errores

La entrada de terminal se lee como texto. Antes de consultar la API se valida
el formato minimo requerido. La salida se imprime con `console.log` para
mensajes y `console.dir(..., { depth: null, colors: true })` para inspeccionar
estructuras anidadas. Una opcion inexistente, un username vacio, un titulo
vacio, un usuario inexistente o una respuesta HTTP fallida generan mensajes
claros dentro del `catch`.
