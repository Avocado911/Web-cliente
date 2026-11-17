# Mision 3 · Videoclub Nebula 🎬

IA como pair · 2-3 h · nivel 2

Objetivo: buscador con filtros sobre datos locales, tema claro/oscuro global y `useEffect` solo donde esta justificado.

Practicas: estado derivado (filtrado en el render), `useContext`, `useEffect` con criterio, composicion.

## Fases

1. Catalogo: `Catalogo` → `TarjetaPelicula` en rejilla (8 peliculas).
2. Busqueda derivada: input por titulo + `<select>` de genero. La lista visible se calcula en el render. Prohibido guardarla en estado o filtrar con un efecto.
3. Tema con contexto: `TemaContext` con `{ tema, alternarTema }`; boton 🌙/☀️ en `Cabecera`; las tarjetas leen el tema con `useContext`.
4. Un efecto justificado: sincronizar `document.title` y `localStorage`; leer el tema inicial con `useState(() => localStorage.getItem("tema") ?? "claro")`.

## Criterios

- [ ] La lista filtrada no esta en ningun `useState`.
- [ ] Busqueda y genero se combinan.
- [ ] El tema llega a las tarjetas por `useContext`, sin prop drilling.
- [ ] El unico `useEffect` es el de titulo/localStorage.
- [ ] Con cero resultados, mensaje amable.

```js
PELICULAS.filter((p) =>
  p.titulo.toLowerCase().includes(busqueda.toLowerCase()) &&
  (genero === "todos" || p.genero === genero))
```

## Retos

- [ ] Ordenacion por nota o ano (copia ordenada: `[...filtradas].sort(...)`).
- [ ] Favoritas ⭐ con filtro «solo favoritas» (¿donde vive ese estado?).
