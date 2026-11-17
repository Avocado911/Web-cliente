# Ejercicios propuestos · Tema 3 (React Core)

Un solo proyecto de Vite con React. Cada ejercicio en `src/ejercicio-NN/` con su enunciado en el README; `App.jsx` deja elegir cual se ve.

```bash
npm install
npm run dev
```

1. **Hola componente.** Crea un proyecto con Vite y un componente `Saludo` que reciba una prop `nombre` y muestre "Hola, {nombre}". Renderizalo tres veces con nombres distintos desde `App`.
2. **Tarjeta de perfil.** Crea un componente `Tarjeta` que reciba props (`nombre`, `rol`, `online`) y use `children` para una descripcion. Aplica renderizado condicional con `&&` para mostrar un punto verde "En linea" solo si `online` es `true`.
3. **Contador con funcion actualizadora.** Implementa un contador con `useState`. Anade un boton "+3" que llame a `setCuenta` tres veces. Hazlo funcionar correctamente usando la funcion actualizadora `(c) => c + 1` y explica en un comentario por que con `cuenta + 1` no funcionaria.
4. **Lista de tareas (inmutabilidad).** Crea una lista de tareas con un input para anadir, un boton para marcar como hecha y otro para borrar. Gestiona el array de estado sin mutarlo (usa spread, `map` y `filter`) y asigna `key` estable a cada `<li>`.
5. **Filtro derivado (sin estado redundante).** Partiendo del ejercicio 4, anade un campo de busqueda. La lista filtrada no debe guardarse en estado: calculala durante el render a partir del texto de busqueda y el array de tareas.
6. **Reloj con useEffect.** Crea un componente `Reloj` que muestre la hora actual y se actualice cada segundo con `setInterval`. Incluye la funcion de limpieza correcta. Anade un boton en el padre para montar/desmontar el reloj y comprueba en la consola que el intervalo se limpia al desmontar.
7. **Levantar el estado.** Crea dos componentes hermanos: uno con un campo de texto y otro que muestre en mayusculas lo que se escriba. Levanta el estado al padre comun y pasalo por props en ambos sentidos.
8. **Tema con useContext.** Implementa un selector de tema (claro/oscuro) usando `createContext` y `useContext`, de modo que un componente nieto lea el tema sin recibirlo por props intermedias (evita el prop drilling).
9. **Reducer de carrito.** Reescribe la logica de un pequeno carrito de la compra (anadir producto, quitar producto, vaciar) usando `useReducer` en lugar de varios `useState`.
10. **(Reto) Refactor anti-efecto.** Te damos un componente que usa `useEffect` para calcular un total a partir de una lista de precios y guardarlo en estado. Refactorizalo para eliminar el efecto y el estado redundante, calculando el total directamente durante el render. Justifica el cambio citando la idea de "You Might Not Need an Effect".
