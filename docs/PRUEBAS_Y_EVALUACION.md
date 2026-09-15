 # Pruebas y evaluacion

## Preparacion

Requisito: Node.js 18 o superior, porque el proyecto utiliza `fetch` nativo.
Desde la raiz del repositorio se ejecuta:

```text
node src/app.js
```

Cada caso exitoso se selecciona desde el menu. Los casos de error se validan
observando que el programa muestre el mensaje dentro de `try/catch` y permita
volver al menu.

## Casos de prueba funcionales

| ID | Entrada | Proposito | Resultado esperado |
|---|---|---|---|
| P01 | Opcion `1` | Consultar tareas | 10 usuarios, cada uno con sus tareas `completed: false`. |
| P02 | Opcion `2`, username `Bret` | Buscar usuario existente | Datos de Ervin Howell, sus albumes y fotos. |
| P03 | Opcion `2`, username `NoExiste` | Probar ausencia de usuario | Error controlado indicando que no se encontro el username. |
| P04 | Opcion `2`, entrada vacia | Probar validacion | Error controlado sin peticion innecesaria. |
| P05 | Opcion `3`, texto `qui` | Filtrar por titulo parcial | Posts cuyos titulos contienen `qui`, cada uno con sus comentarios. |
| P06 | Opcion `3`, texto `ZZZ_NO_EXISTE` | Probar cero coincidencias | Arreglo vacio, sin fallo no controlado. |
| P07 | Opcion `3`, entrada vacia | Probar validacion | Error controlado indicando que se requiere un titulo. |
| P08 | Opcion `4` | Transformar usuarios | Arreglo de 10 objetos con exactamente `name` y `phone`. |
| P09 | Opcion `5` | Enriquecimiento completo | Cada usuario incluye posts/comentarios y albumes/fotos. |
| P10 | Opcion invalida `9` | Validar menu | Mensaje de opcion no valida y retorno al menu. |
| P11 | Error de red o API no disponible | Probar fallo externo | `fetch` falla, el `catch` muestra contexto y el proceso no colapsa silenciosamente. |

## Verificacion tecnica

1. Ejecutar `node --check src/app.js`.
2. Ejecutar `node --check` sobre cada archivo de `src/modules`.
3. Ejecutar los casos P01 a P10 desde la terminal.
4. Confirmar que P08 no contiene propiedades diferentes de `name` y `phone`.
5. Confirmar que P05 contiene `comments` en cada post encontrado.
6. Confirmar que P09 mantiene las relaciones `userId`, `postId` y `albumId`.
7. Simular una entrada invalida y comprobar el mensaje del `catch`.

## Criterios de aprobacion

La solucion se considera correcta cuando las pruebas exitosas devuelven la
estructura esperada, las entradas invalidas producen errores explicitos y el
programa continua disponible para otra opcion. Una prueba falla si el proceso
termina sin mensaje, si realiza una transformacion con campos no solicitados o
si pierde alguna relacion entre usuario, post, comentario, album o foto.

## Evidencia para entregar

Se deben conservar capturas o transcripciones de P01, P02, P03, P05, P07,
P08, P09 y P10. Tambien debe incluirse el enlace al repositorio publico y la
salida de `git branch --all` para evidenciar las ramas `main`, `develop` y
`feature/nombre-funcionalidad`.
