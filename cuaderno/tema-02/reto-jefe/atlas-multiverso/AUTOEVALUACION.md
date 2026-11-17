# Atlas multiverso · autoevaluacion

Arrancar: `npm install` y `npm run dev` → http://localhost:5173

## Checkpoints

1. **Datos en consola:** cada busqueda escribe `peticiones reales: N · en cache: M`.
2. **Tarjetas:** nombre, imagen, especie y estado, creadas con `createElement` en `ui.ts`.
3. **Cache en Network:** buscar `rick`, luego `morty`, y volver a `rick` (con ← del navegador o escribiendolo). La tercera no sale en Network.
4. **Favoritos tras F5:** ⭐ en varias tarjetas, F5, siguen marcados. En Application → Local Storage → `atlas-favoritos`.
5. **Estadisticas:** boton «Ver estadisticas». La primera vez aparece en Network un `estadisticas-*.js` nuevo (import dinamico).

## Rubrica (25/25)

| Criterio | Puntos | Donde |
|---|---|---|
| Asincronia y errores | 5 | `api.ts`: `try/catch` y `respuesta.ok` en cada peticion; timeout con `AbortController` (8 s); una busqueda nueva cancela la anterior; 5 tipos de error con mensaje distinto en la pagina (`ui.ts`, `AYUDA`) |
| Cache con Map | 5 | `api.ts`: `Map` con clave = URL, caducidad de 5 min y maximo de 30 entradas (borra la mas vieja) |
| Inmutabilidad y datos | 5 | `estado.ts`: estado centralizado `readonly`, transiciones puras que devuelven un estado nuevo, `structuredClone` en `instantanea()` (en la consola: `atlas()`) |
| TypeScript | 5 | Uniones (`EstadoVital`, `TipoError`), genericos (`RespuestaApi<T>`, `$<T>`), utilidades (`Pick`, `Partial` via `groupBy`, `Record<TipoError, string>`), type guards en lugar de `any`. Cero `any` |
| Codigo y estructura | 5 | Modulos `api`, `estado`, `ui`, `estadisticas` y `main` con `import`/`export`; `npm run build` limpio |

## Extras hechos

- Paginacion: botones ← → con `info.prev` e `info.next`.
- Enrutado con `history.pushState`: la busqueda va en la URL (`?nombre=rick&pagina=2`). F5, el enlace compartido y atras/adelante funcionan. Va en los parametros y no en la ruta, asi que el servidor nunca da 404 al recargar.
- `import()` dinamico del panel de estadisticas.
- Seguridad: el texto de la API nunca va por `innerHTML` (sin XSS) y en `localStorage` solo hay favoritos, nada sensible.
