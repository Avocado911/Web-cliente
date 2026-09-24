# Reto jefe · Caza al bug 👾

Nivel 3 · IA libre (declarada) · 2-3 h

Un whack-a-mole en vanilla JS: los bugs aparecen y desaparecen en una cuadricula de 3 x 3 y hay que aplastarlos antes de que acabe el tiempo.

## Requisitos minimos

- Cuadricula de 9 casillas (nueve `<button>`) y marcador con puntos y tiempo.
- "Jugar": cada cierto intervalo un 🐛 aparece en una casilla aleatoria y desaparece. `setTimeout` encadenado.
- Clic en bug: +1 y desaparece. Clic en vacia: -1 (minimo 0).
- La partida dura 30 s; al terminar, mensaje segun puntuacion y ningun bug mas aparece.
- Funciones con nombre claro (`aparecerBug`, `finDePartida`, `actualizarMarcador`...), cero `var`, cero errores en consola.

## Retos extra

- [ ] Dificultad creciente cada 10 s.
- [ ] Bug dorado ✨ (5 puntos).
- [ ] Record de la sesion.

## Rubrica de autoevaluacion

| Criterio | Basico | Bien | Excelente |
|---|---|---|---|
| Funcionalidad | El bug aparece y se puntua, con fallos ocasionales | Puntos, reloj y fin de partida funcionan siempre | + al menos un reto extra funcionando |
| DOM y eventos | Mezcla `innerHTML` y estilos sin criterio | `textContent`, `classList` y `addEventListener` correctos | Manejadores con `for...of` o delegacion; `event.target` con soltura |
| Calidad del codigo | Globales sueltas y nombres cripticos | `const`/`let` bien elegidos, funciones pequenas y claras | Estado agrupado, funciones puras, cero repeticion |
| Robustez | Se rompe (doble clic en "Jugar", clics tras el final) | Los casos raros estan controlados | Ningun `setTimeout` sobrevive al fin; consola impecable |
| Comprension | Sabes que hace a grandes rasgos | Explicas cada funcion a un companero | Justificas cada decision |

La fila "Comprension" es la que se examina en la defensa oral de la Arena.
