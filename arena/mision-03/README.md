# 📚 Biblioteca Arcana · React

Mision M3 de la WebI Arena: "Reactor Core". Todo es un componente.

Reconstruccion en React 19 de la Biblioteca Arcana de la [mision 2](../mision-02): un buscador de libros sobre la API publica de [OpenLibrary](https://openlibrary.org/developers/api) con orden, filtros, estadisticas y una estanteria de favoritos que se conserva al recargar. Ademas de pasarla a componentes, se anade lo que la autopsia de la M2 dejo pendiente: una ficha de detalle de cada libro con su descripcion y sus temas.

## Como ejecutarlo

```bash
npm install
npm run dev
```

Despues, abrir la direccion que muestra la terminal (por defecto `http://localhost:5173`).

Para generar la version de produccion: `npm run build` (sale en `dist/`).

## Funcionalidades

- Busqueda por titulo o autor con un formulario controlado.
- Estados visibles: inicio, cargando, error (con boton de reintentar), sin resultados y resultados.
- Errores diferenciados: sin conexion, servidor con error y tiempo de espera agotado.
- Una busqueda nueva cancela la anterior: la limpieza del `useEffect` aborta la peticion vieja.
- Ordenar por relevancia, ano o titulo y filtrar por libros en espanol o con portada, sobre los datos ya descargados.
- Estadisticas de los libros visibles: libros por decada, media de paginas y libro mas antiguo.
- Estanteria de favoritos guardada en `localStorage`.
- **Nuevo:** ficha de detalle de cada libro (clic en el titulo, en los resultados o en la estanteria) con la descripcion y los temas de la obra, que se piden aparte a OpenLibrary. Se cierra con ✕, con Escape o haciendo clic fuera.
- **Bonus:** custom hook `useLocalStorage`, reutilizable para cualquier valor que deba sobrevivir a una recarga.

## Estructura

```
mision-03/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                 # Monta <App /> en #raiz
    ├── App.jsx                  # Estado de la app y estado derivado
    ├── componentes/
    │   ├── Buscador.jsx         # Formulario controlado
    │   ├── Controles.jsx        # Orden y filtros
    │   ├── Mensaje.jsx          # Texto segun el estado de la busqueda
    │   ├── ListaLibros.jsx      # Lista de tarjetas (key = id de la obra)
    │   ├── TarjetaLibro.jsx     # Un libro
    │   ├── Portada.jsx          # Imagen o hueco si no hay portada
    │   ├── Estadisticas.jsx     # Panel calculado de los libros visibles
    │   ├── Estanteria.jsx       # Favoritos
    │   └── DetalleLibro.jsx     # Ficha de detalle
    ├── hooks/
    │   ├── useBusquedaLibros.js # Efecto: busqueda con cancelacion
    │   ├── useDetalleLibro.js   # Efecto: ficha de una obra
    │   └── useLocalStorage.js   # Bonus: estado persistente
    ├── logica/                  # JavaScript sin React, reutilizado de la M2
    │   ├── api.js               # Peticiones, errores propios y cache
    │   ├── datos.js             # Funciones puras: normalizar, filtrar, ordenar, estadisticas, texto de detalles
    │   └── almacen.js           # localStorage sin romper con datos corruptos
    └── style.css
```

Los componentes solo pintan lo que reciben por props y avisan hacia arriba con callbacks (`onBuscar`, `onAlternarFavorito`, `onAbrir`...). El estado compartido vive en `App`, que es el antecesor comun de quien lo lee y quien lo cambia. `logica/` no sabe nada de React: es la misma de la M2, y por eso se ha podido reutilizar casi sin cambios.

## Decisiones tecnicas

- **Estado minimo en `App`:** solo lo que elige el usuario: texto buscado, orden, filtros, favoritos y el libro abierto. Los libros visibles, las estadisticas y el conjunto de ids favoritos se calculan en cada render a partir de eso, asi nunca se desincronizan. No hay `useMemo`: con 40 libros recalcular cuesta menos que razonar sobre la memoizacion.
- **Cero mutaciones:** los favoritos cambian con `alternarFavorito`, que devuelve un array nuevo, y la forma funcional `setFavoritos((anteriores) => ...)`; los filtros con `{ ...filtros, [nombre]: valor }`; el orden con `toSorted`.
- **`key` estable:** cada tarjeta usa el id de la obra de OpenLibrary (`/works/OL...W`), nunca el indice, porque el orden y el filtro cambian la posicion de cada libro.
- **`useEffect` solo para sincronizar con lo de fuera:** la red (busqueda y detalle) y un listener de teclado en `document`. Los tres tienen limpieza: `AbortController.abort()` para las peticiones y `removeEventListener` para el teclado. Lo que se puede calcular durante el render (filtros, orden, estadisticas) no pasa por ningun efecto.
- **"Cargando" deducido:** el hook de busqueda guarda solo la ultima respuesta junto al texto y el intento de la peticion que la produjo. Si no coinciden con la busqueda actual, se esta cargando. El efecto depende justo de esos dos valores (`[texto, intento]`), sin claves derivadas redundantes. Una respuesta vieja nunca puede pintarse encima de una nueva.
- **Libro abierto como copia:** `App` guarda el objeto del libro abierto, no solo su id. Con el id habia que buscarlo en resultados y estanteria, y si se quitaba de favoritos sin estar en los resultados la ficha se cerraba sola. Los datos de un libro no cambian, asi que la copia no se desincroniza; lo que si cambia (si esta marcado) se sigue derivando de `favoritos`.
- **Ficha accesible:** al abrirse lleva el foco al boton de cerrar; Tab y Shift+Tab dan la vuelta dentro de la ficha (trampa de foco) y no se escapan a la pagina de detras; al cerrarse devuelve el foco al elemento que la abrio. Escape y clic en el fondo tambien cierran.
- **Utilidades fuera de los componentes:** `textoDetalles` vive en `logica/datos.js` y la usan la tarjeta y el detalle; ningun componente importa funciones de un componente hermano.
- **`useCallback` en `cerrarDetalle`:** el efecto del teclado depende de `onCerrar`; con la misma funcion entre renders el listener no se quita y se vuelve a poner en cada render.
- **Formulario controlado:** el valor del input vive en el estado de `Buscador`. Solo se avisa a `App` al enviar, para no lanzar una peticion por cada tecla.
- **Sin `dangerouslySetInnerHTML`:** todo el texto de la API se pinta como texto en JSX, que React escapa.

## Autopsia

### Las dos decisiones mas discutibles

**1. Deducir "cargando" en vez de guardarlo.** El hook podria tener un estado `cargando` y hacer `setCargando(true)` al empezar el efecto y `false` al acabar. Se descarto porque obliga a cambiar el estado de forma sincrona dentro del efecto (un render extra) y porque son dos estados que hay que mantener de acuerdo: si una respuesta vieja llega tarde puede apagar el `cargando` de la nueva. Guardando la respuesta junto a su clave, el estado es uno solo y "cargando" sale de compararlo. El precio es que el hook se entiende peor a primera vista y que reintentar la misma busqueda necesita un contador (`intento`) para que la clave cambie.

**2. Dos hooks parecidos en vez de un `useFetch` generico.** `useBusquedaLibros` y `useDetalleLibro` repiten el mismo esqueleto (controlador, `then`, `catch`, limpieza). Un `useFetch(url)` lo unificaria. Se descarto porque cada uno hace algo propio: la busqueda pasa por la cache, normaliza una lista y tiene reintento; el detalle normaliza una obra. Un hook generico tendria que recibir funciones por parametro, y entonces habria que estabilizarlas con `useCallback` para no repetir la peticion en cada render. Con dos casos la duplicacion sale mas barata. Si apareciera un tercero, se extraeria.

### Problemas encontrados

- **La descripcion llega en dos formatos.** OpenLibrary la manda a veces como texto y a veces como `{ type, value }`, y muchas acaban con una lista de enlaces separada por guiones. `normalizarDetalle` lo deja siempre en texto limpio o `null`.
- **Temas repetidos.** Algunas obras repiten temas, y la `key` de cada tema es su texto: se quitan los duplicados con un `Set` antes de pintarlos.
- **StrictMode monta los efectos dos veces en desarrollo.** La primera peticion se aborta en la limpieza y la segunda es la que vale, que es justo el caso que la limpieza tenia que cubrir.

### Limitaciones conocidas

- Como en la M2, la API devuelve como maximo 40 resultados y no hay paginacion.
- Si la ficha se abrio desde la estanteria y el libro se quita de favoritos desde la propia ficha, al cerrarla el boton que la abrio ya no existe y el foco no tiene a donde volver (queda en el documento).

## Cambios tras el feedback

- `textoDetalles` se ha movido de `TarjetaLibro.jsx` a `logica/datos.js`.
- `useBusquedaLibros` ya no depende de `[texto, clave]` (la clave contenia el texto): la respuesta guarda `texto` e `intento` y el efecto depende de `[texto, intento]`.
- La ficha tiene trampa de foco y devuelve el foco al elemento que la abrio.
- El libro abierto se guarda como copia, asi que la ficha ya no se cierra sola al quitarlo de favoritos.
- Pendiente del feedback de la M2 en `logica/api.js`: `respuesta.json()` ahora esta dentro de un `try/catch` (un cuerpo que no es JSON da un `ErrorBiblioteca`), se comprueba `Array.isArray(datos.docs)` antes de usarlo y la cache leida de `localStorage` se valida y descarta las entradas corruptas.
- `useFetch` generico: se mantiene la decision de la autopsia. Sigue habiendo solo dos peticiones; se extraera si aparece una tercera.

## Tecnologias

React 19, Vite 8, JavaScript (modulos ES), HTML y CSS.

## Uso de IA

- **Que pedi:** que la IA (Claude) reconstruyera en React la Biblioteca Arcana de la M2, reutilizando su logica, con componentes pequenos, estado minimo, efectos con limpieza, un custom hook de bonus y la vista de detalle que deje pendiente en la autopsia de la M2.
- **Como lo verifique:** probando la app en el navegador (busquedas, filtros, favoritos tras recargar, detalle, cerrar con Escape, sin conexion) y comprobando que compila con `npm run build`. Repase cada fichero hasta poder explicar por que cada estado esta donde esta y por que cada efecto tiene su limpieza.
- **Que escribi a mano:** la logica de `logica/` viene de mi M2. El codigo React lo genero la IA y yo lo revise y lo estudie para la defensa.
