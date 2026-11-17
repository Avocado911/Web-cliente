# Mision 1 · Trivial de la Academia 🚀

IA como pair · 90-120 min · nivel 2

Objetivo: un quiz completo con estado, puntuacion y pantalla de resultados.

Practicas: varios `useState`, «pantallas» por renderizado condicional, listas con `key`, estado derivado, inmutabilidad.

```js
// src/misiones/quiz/preguntas.js
export const PREGUNTAS = [
  { id: "q1",
    texto: "¿Que hook anade memoria a un componente?",
    opciones: ["useEffect", "useState", "useRef", "useContext"],
    correcta: 1 },
  // … q2, q3, q4
];
```

## Fases

1. Pantalla de pregunta: `Quiz.jsx` con `indice` y `puntos`; texto y opciones como botones (lista con `key`).
2. Responder y avanzar: acierto → +1; siempre → siguiente pregunta.
3. Pantalla final: si `indice` llega al final, componente `Resultado` («N de M aciertos», mensaje por porcentaje, «Jugar otra vez» que reinicia ambos estados).
4. Feedback visual: estado `seleccion` para marcar la opcion (verde/roja) antes de avanzar.

## Criterios de aceptacion

- [ ] El quiz avanza pregunta a pregunta y la puntuacion es correcta.
- [ ] La pantalla final muestra los aciertos y permite reiniciar.
- [ ] Los botones de opciones se generan con `.map()` y `key` estable.
- [ ] El porcentaje/mensaje final se deriva de `puntos`, sin guardarse en estado.
- [ ] No hay warnings en la consola del navegador.

Pista: en la fase 4, guarda en `seleccion` el indice pulsado (o `null`) y calcula la clase CSS de cada boton durante el render.

## Retos extra

- [ ] Barajar las preguntas al empezar: una copia desordenada, sin mutar `PREGUNTAS`.
- [ ] Barra de progreso («Pregunta 2 de 4») y racha de aciertos seguidos.
