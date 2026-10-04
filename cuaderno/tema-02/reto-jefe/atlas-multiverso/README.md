# Reto jefe · "Atlas multiverso": tu primera SPA sin frameworks 👑

Nivel 3 · IA libre (declarada) · 4-5 h

Catalogo de personajes de Rick and Morty (`rickandmortyapi.com/api/character`) en Vite + TypeScript, con cache en memoria y favoritos persistentes. Integra todo lo anterior.

## Requisitos

- **Busqueda:** `<input>` + boton -> `?name=<texto>` -> tarjetas (nombre, imagen, especie, estado) generadas desde JS.
- **Arquitectura:** `class ClienteApi` (o factory) con `fetch`, `respuesta.ok` y cache en `Map` (clave: la URL). Misma busqueda dos veces = una peticion (Network).
- **Errores visibles:** 404 o fallo de red -> mensaje amable, nunca consola en rojo.
- **Favoritos:** ⭐ por tarjeta, en `localStorage`, restaurados al recargar.
- **Estadisticas:** recuento por especie con `Object.groupBy`; favoritos con `toSorted`.
- **Tipos:** `Personaje` y `RespuestaApi`; cero `any`.

```
atlas-multiverso/
├── index.html
└── src/
    ├── main.ts     # arranque y eventos
    ├── tipos.ts    # Personaje, RespuestaApi
    ├── api.ts      # ClienteApi: fetch + Map
    ├── estado.ts   # favoritos + localStorage
    └── ui.ts       # tarjetas, errores, stats
```

Checkpoints: datos en consola -> tarjetas -> cache verificada en Network -> favoritos tras F5 -> estadisticas.

## Retos extra

- [ ] Paginacion (`info.next`/`prev`).
- [ ] Enrutado con `history.pushState`.
- [ ] `import()` dinamico del panel de estadisticas.

## Rubrica de autoevaluacion (18+ es nivel jefe)

| Criterio | 0 puntos | 3 puntos | 5 puntos |
|---|---|---|---|
| Asincronia y errores | Solo el camino feliz | `try/catch` y `respuesta.ok` en cada peticion | Ademas: timeout o cancelacion, y mensajes de error diferenciados en la UI |
| Cache con Map | No hay cache | La cache evita peticiones repetidas | Ademas: expiracion por tiempo o limite de tamano |
| Inmutabilidad y datos | Mutaciones por todas partes | Transformaciones con metodos inmutables | Ademas: estado centralizado, funciones puras y `structuredClone` donde toca |
| TypeScript | Tipos minimos o `any` sueltos | Interfaces para API y funciones tipadas | Ademas: uniones, genericos o utilidades (`Partial`, `Record`) bien empleados |
| Codigo y estructura | Todo en un fichero | Modulos separados (api, estado, UI) con `import`/`export` | Ademas: nombres cuidados, sin codigo muerto y `npm run build` limpio |

Las cinco filas son las mismas que puntua la Arena en M2: el reto jefe es un candidato a entrega.

Nota: el proyecto de Vite se crea con `npm create vite@latest` dentro de esta carpeta cuando se empiece el reto.
