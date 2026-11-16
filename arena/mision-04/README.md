# 📜 Biblioteca Arcana · Registro de socios

Mision M4 de la WebI Arena: "Full Contact Forms". Valida o muere.

La Biblioteca Arcana de la [mision 2](../mision-02) y la [mision 3](../mision-03) abre su registro de socios: un formulario de solicitud de carne (React Hook Form + Zod) y el listado de socios, que se pide y se actualiza con TanStack Query v5 contra un API REST.

## Como ejecutarlo

```bash
npm install
npm run dev
```

`npm run dev` arranca dos cosas a la vez: el API (`json-server`, en `http://localhost:3001`) y la web (Vite, en `http://localhost:5173`). Hay que abrir la segunda.

- `npm run restaurar` devuelve los datos al estado de partida (3 socios y 1 registro corrupto a proposito).
- `npm run build` genera la version de produccion en `dist/`.
- Para ver el estado de error: parar el API (o arrancar solo `npm run web`) y recargar.

El API responde con 600 ms de retraso (`--delay 600`) para que los estados de carga se lleguen a ver en local.

## Funcionalidades

- **Formulario de solicitud** con 8 campos: nombre, correo, edad, tutor (solo si eres menor), tipo de carne, seccion favorita, motivo (opcional) y aceptar las normas.
- **Validacion solo con Zod**: no hay ni un `required` en el JSX. Mensajes propios en castellano, conversion de la edad a numero, correo limpiado (sin espacios, en minusculas) y dos reglas que cruzan campos:
  - un menor de edad tiene que indicar un tutor;
  - el carne de investigador es solo para mayores de edad.
- **Errores accesibles**: cada error sale debajo de su campo con `role="alert"`, el campo lleva `aria-invalid` y `aria-describedby` apunta a su ayuda y a su error; al enviar con fallos, el foco va al primer campo incorrecto.
- **Error del servidor en su campo**: si el correo ya esta registrado, el error aparece en el campo del correo (con `setError`), no como un aviso generico.
- **Listado de socios** con `useQuery`: primera carga, error con boton de reintentar, lista vacia, datos y un "actualizando…" cuando refresca en segundo plano.
- **Filtro por tipo de carne**: lo aplica el servidor y va dentro de la clave de la consulta, asi que cada filtro tiene su propia cache. Al cambiarlo se mantiene la lista anterior hasta que llega la nueva.
- **Alta y baja** con `useMutation`; las dos invalidan el listado (con cualquier filtro). El boton se desactiva mientras se envia y hay aviso de exito y de error.
- **Baja con confirmacion**: el primer clic solo pregunta "¿Seguro?"; hay que confirmar o cancelar.
- **Contador en vivo** de los caracteres del motivo ("37/200"), que avisa al pasarse.
- **Bonus**: la respuesta del API tambien pasa por Zod con `safeParse`. Los datos de partida traen un registro corrupto (edad `"muchos"`, correo sin arroba, carne inexistente, fecha `"ayer"`): la app lo aparta del listado, ensena por que no vale y deja purgarlo. El resto de socios se ve con normalidad.

## Estructura

```
datos/
  semilla.json        datos de partida (con el registro corrupto)
  preparar.js         copia la semilla a db.json, que es lo que sirve json-server
src/
  main.jsx            QueryClient y QueryClientProvider
  App.jsx             cabecera y los dos paneles
  componentes/
    FormularioSocio   useForm + zodResolver + mutacion de alta
    Campo             etiqueta + control + ayuda + error, con los atributos ARIA
    ListaSocios       filtro, estados del useQuery y mutacion de baja
    TarjetaSocio      un socio y la confirmacion de su baja
    RegistrosCorruptos  lo que no paso la validacion de la respuesta
    Aviso             mensaje de estado (cargando, error, exito, vacio)
    ContadorCaracteres  contador en vivo de un campo
  hooks/
    useSocios         useQuery del listado (con el filtro en la clave)
    useAltaSocio      useMutation del alta + invalidacion
    useBajaSocio      useMutation de la baja + invalidacion
  logica/
    esquemas.js       esquemas Zod (formulario y respuesta del API)
    catalogo.js       tipos de carne, secciones y limites de edad
    api.js            todo el fetch
    claves.js         claves de TanStack Query
```

## Decisiones tecnicas

- **Un esquema, dos usos.** Los campos del socio se definen una vez (`camposSocio`) y de ahi salen el esquema del formulario (anade la casilla y las reglas cruzadas) y el de la respuesta del API (anade `id` y `alta`). Si manana cambia el maximo del nombre, se cambia en un sitio y vale para lo que entra y para lo que llega.
- **Formulario no controlado.** Los inputs se registran con `register`: React Hook Form lee el valor del DOM por la `ref` y el componente no se vuelve a pintar en cada tecla. Solo se observan dos valores con `useWatch`: la edad, porque de ella depende que aparezca el campo del tutor, y el motivo, dentro de `ContadorCaracteres`, para que al teclear se repinte el contador y no el formulario entero.
- **`mode: "onTouched"`.** No se molesta al usuario con errores mientras escribe por primera vez: el campo se valida al salir de el y, a partir de ahi, en cada cambio, para que vea el error desaparecer al corregirlo.
- **El esquema tambien limpia.** El `transform` final quita la casilla de normas (no es un dato del socio) y los campos vacios, asi que a `onSubmit` llega exactamente lo que se manda al API.
- **Claves en un fichero y con el filtro dentro.** `clavesSocios.todas` es `["socios"]` y `clavesSocios.lista({ carne })` es `["socios", "lista", { carne }]`. Como el filtro forma parte de la clave, cambiarlo lanza la peticion sin ningun `useEffect` y volver a un filtro ya visto sale de la cache. Las mutaciones invalidan la general, que alcanza a todas las que empiezan igual, sea cual sea el filtro.
- **Filtrar en el servidor.** El filtro viaja como `?carne=lector` en vez de hacer un `.filter()` sobre lo descargado: es lo que escala si el archivo crece, y `placeholderData: keepPreviousData` evita el parpadeo de "cargando" al cambiar.
- **Confirmacion de baja como estado local.** Cada tarjeta guarda con `useState` si esta preguntando "¿Seguro?": no le importa a ningun otro componente, asi que no sube a la lista ni a la cache.
- **La invalidacion se espera.** `onSuccess` devuelve la promesa de `invalidateQueries`, asi la mutacion sigue pendiente hasta que llega el listado nuevo y el aviso de exito aparece a la vez que el socio en la lista.
- **Capa de servicios.** Los componentes no hacen `fetch`: llaman a hooks, y los hooks a `api.js`. Ahi se comprueba `response.ok` (porque `fetch` no falla con un 404 o un 500) y se traduce el fallo de red a un mensaje entendible.
- **`safeParse` y no `parse` en el listado.** `parse` lanzaria con el primer registro malo y el usuario se quedaria sin listado por culpa de un solo dato. Con `safeParse` registro a registro se salva lo valido y se informa de lo que no lo es.
- **`json-server` sobre una copia.** `json-server` escribe en el fichero que sirve; por eso sirve `datos/db.json` (fuera de git) y `semilla.json` no cambia con cada alta.

## Autopsia

Las dos decisiones mas discutibles:

1. **El correo repetido se comprueba en el cliente, con una peticion previa al POST.** `json-server` no tiene reglas de negocio, asi que `crearSocio` pregunta antes si ya hay un socio con ese correo. Entre la pregunta y el alta otra persona podria registrarse con el mismo correo (condicion de carrera), y cualquiera que llame al API a mano se salta la regla. La alternativa correcta es que la unicidad la imponga el servidor y responda con un 409, y que el cliente solo traduzca ese 409 al campo; la descarte porque exigia escribir un backend propio y la mision va del cliente. El codigo ya esta preparado para ese cambio: el formulario solo sabe que le llega un `ErrorDeCampo`.

2. **Tras cada mutacion se invalida y se vuelve a pedir el listado entero, sin actualizacion optimista.** Es lo mas simple y lo que nunca miente: en pantalla solo hay lo que el servidor ha confirmado. A cambio, cada alta o baja cuesta una peticion mas y el cambio tarda en verse lo que tarde el servidor. La alternativa era tocar la cache a mano con `setQueryData` en `onMutate` (pintar el socio al instante y deshacerlo si falla); la descarte porque con un listado pequeno la espera se cubre con el boton en estado "enviando" y el codigo de deshacer es justo donde aparecen los errores dificiles de ver.

## Tecnologias

React 19, Vite, React Hook Form, Zod 4, `@hookform/resolvers`, TanStack Query v5 y `json-server` como API de desarrollo. CSS propio, sin librerias de estilos.

## Uso de IA

- **Herramienta:** Claude Code (Claude, de Anthropic) en la terminal.
- **Que partes:** la IA propuso el plan (dominio, estructura, API con `json-server`) y genero el codigo de la app y el borrador de este README. Yo decidi sobre sus propuestas y lo revise.
- **Decisiones mias sobre la primera version:** despues de probarla pedi anadir el filtro por tipo de carne, la confirmacion antes de dar de baja y el contador en vivo del motivo, y que se viera desde el principio que la edad minima es 12 (la ayuda del campo); decidi mantener la validacion al salir de cada campo en vez de en cada tecla y el retraso de 600 ms del API para que se vean los estados de carga.
- **Prompts reales:**
  - "Vale, perfecto. Planteame lo de la M4 para empezar a hacerla."
  - "Pero ¿por que se hace en React y no en Next.js? ¿Y que es lo que hay que hacer?" (la respuesta: el enunciado pide una app React con RHF, Zod y TanStack Query, y eso es lo que comprueban los checks).
- **Como se verifico:** `npm run build` sin errores; el esquema probado con casos validos e invalidos (campos vacios, edad con letras, menor sin tutor, menor con carne de investigador); y una prueba contra el `json-server` real con el mismo codigo de `api.js`: listado con el registro corrupto apartado, alta, intento de alta con el correo repetido y baja. Despues probe la app a mano en el navegador.
- **Que escribi a mano:** el codigo lo genero la IA. Mi parte fue elegir entre las alternativas, probar la app y estudiar cada fichero hasta poder explicar por que la validacion vive solo en el esquema, que hace cada clave y por que se invalida en vez de tocar la cache.
