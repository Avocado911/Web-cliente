# 📚 Biblioteca Arcana

Mision M2 de la WebI Arena: "Async Odyssey".

Buscador de libros que consulta la API publica de [OpenLibrary](https://openlibrary.org/developers/api). Muestra portada, autores, ano y paginas de cada libro; permite ordenar y filtrar los resultados, ver estadisticas de la busqueda y guardar libros en una estanteria personal que se conserva al recargar.

## Como ejecutarlo

```bash
npm install
npm run dev
```

Despues, abrir la direccion que muestra la terminal (por defecto `http://localhost:5173`).

Para generar la version de produccion: `npm run build` (sale en `dist/`).

## Funcionalidades

- Busqueda por titulo o autor contra `https://openlibrary.org/search.json`.
- Estados visibles: inicio, cargando, error, sin resultados y resultados.
- Errores diferenciados: sin conexion, servidor con error (`respuesta.ok` falso) y tiempo de espera agotado.
- Una busqueda nueva cancela la anterior con `AbortController`, para que una respuesta lenta no pise a la nueva.
- Ordenar por relevancia, ano (ascendente o descendente) o titulo; filtrar por libros en espanol o con portada. Se aplica sobre los datos ya descargados, sin repetir la peticion.
- Estadisticas de los resultados visibles: libros por decada, media de paginas y libro mas antiguo.
- Estanteria de favoritos guardada en `localStorage`.
- **Bonus:** cache de busquedas en `localStorage`, con caducidad de una hora y un maximo de 20 busquedas guardadas.

## Estructura

```
mision-02/
├── index.html
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.js      # Arranque, estado de la app y eventos
    ├── api.js       # Peticiones a OpenLibrary, errores propios y cache
    ├── datos.js     # Transformaciones puras: normalizar, filtrar, ordenar, estadisticas
    ├── ui.js        # Render en el DOM
    ├── almacen.js   # Lectura y escritura segura en localStorage
    └── style.css
```

Cada modulo tiene una responsabilidad: `api.js` no sabe nada del DOM, `datos.js` no hace peticiones ni toca el DOM, y `ui.js` solo pinta lo que le pasan.

## Decisiones tecnicas

- **`async/await` con `try/catch` y `respuesta.ok`:** `fetch` solo falla por problemas de red; un 404 o un 500 llegan como respuesta normal, asi que se comprueba `respuesta.ok` y se lanza un error propio.
- **Clase `ErrorBiblioteca`:** extiende `Error` con un `tipo` (`red`, `servidor`, `tiempo`) para mostrar un mensaje distinto en cada caso.
- **Timeout y cancelacion:** `AbortSignal.any` combina la cancelacion de la busqueda anterior con un limite de 8 segundos (`AbortSignal.timeout`).
- **Transformaciones sin mutar:** `map` para normalizar los datos de la API, `filter` para los filtros, `toSorted` para ordenar, `Object.groupBy` para agrupar por decada y `reduce` para la media y el libro mas antiguo.
- **Estado centralizado:** el objeto `estado` de `main.js` guarda los libros, los favoritos y la busqueda en curso; el DOM solo lo refleja.
- **Delegacion de eventos:** un listener en el contenedor de resultados y otro en la estanteria, porque las tarjetas se crean de nuevo cada vez que se pinta.
- **Sin `innerHTML`:** todo el texto que viene de la API se inserta con `textContent`.

## Autopsia

### Problemas encontrados y como se resolvieron

- **`fetch` no falla con un error HTTP.** Un 503 de OpenLibrary llegaba como una respuesta normal y la app intentaba leer resultados que no existian. Se resolvio comprobando `respuesta.ok` y lanzando `ErrorBiblioteca`.
- **Busquedas que se pisan.** Si se lanzaban dos busquedas seguidas y la primera tardaba mas, sus resultados aparecian encima de los de la segunda. Se resolvio cancelando la peticion anterior con `AbortController` e ignorando el `AbortError`.
- **Libros sin ano al ordenar.** Muchos libros no tienen `first_publish_year`, y restar `null` daba ordenes incoherentes. Se resolvio con una funcion de comparacion que manda siempre los libros sin ano al final.
- **Datos incompletos de la API.** Hay libros sin autor, sin portada o sin numero de paginas. `normalizarLibro` los convierte a un formato fijo con valores por defecto (`??`) antes de pintarlos.
- **`localStorage` corrupto.** Si se guarda texto invalido a mano, `JSON.parse` lanzaba una excepcion al arrancar. `almacen.js` lo captura y devuelve un valor por defecto.

### Limitaciones conocidas

- La API devuelve como maximo 40 resultados por busqueda; no hay paginacion.
- El filtro "solo en espanol" depende de que OpenLibrary tenga registrado el idioma del libro.

### Que haria distinto

- Anadir paginacion para recorrer todos los resultados.
- Anadir una vista de detalle de cada libro con su descripcion.

## Tecnologias

JavaScript (modulos ES), Vite, HTML y CSS. Sin frameworks.

## Uso de IA

Para ser totalmente transparente con el desarrollo de este proyecto, quiero detallar cómo he integrado herramientas de Inteligencia Artificial en mi flujo de trabajo. Básicamente, la he utilizado como un asistente para agilizar tareas repetitivas, pero el núcleo del proyecto es mío.

### 🛠️ ¿En qué me ayudó la IA?

- **Maquetación y Diseño:** Me echó una mano generando la estructura base en HTML y los estilos en CSS, así como con algunas ideas para la interfaz.
    
- **Lógica secundaria:** Me dio sugerencias puntuales para estructurar partes menos críticas del código.
    
- **Caza de bugs (Debugging):** La utilicé para encontrar errores en el código de forma más rápida cuando me quedaba atascado.

### 👨‍💻 ¿Qué he desarrollado yo? (El core del proyecto)

- **El "cerebro" (JavaScript):** Toda la programación funcional, la lógica principal de la aplicación y la interactividad están hechas a mano por mí.
    
- **Arquitectura:** La creación, organización y vinculación de todos los archivos y carpetas que ves en este repositorio.
    
- **Solución real de problemas:** Aunque la IA me ayudó a detectar fallos o me sugirió código, **yo mismo analicé, adapté y apliqué cada solución**, asegurándome de que todo encajara perfectamente con la lógica de mi JavaScript.

> **En resumen:** He usado la IA para montar el "cascarón" (HTML/CSS) más rápido y como patito de goma para encontrar errores, pero el motor del proyecto y toda la lógica de programación es 100% trabajo mío.
