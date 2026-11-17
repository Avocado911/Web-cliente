# Actividad A1 · Code review al replicante 🤖

50 min · individual o parejas · prepara la mision M3

Una IA ha generado `Leaderboard.jsx`, el ranking de un juego. Compila, se renderiza y a primera vista funciona. Pero contiene 3 bugs sutiles y 2 malas practicas, y quien lo entregue tal cual sufrira en la defensa.

Tarea: un informe tipo pull request review con una entrada por defecto:

- Donde esta (linea o fragmento).
- Por que es un defecto, con el concepto de la U3 que lo explica (inmutabilidad, estado derivado, dependencias de efectos, keys…).
- El arreglo propuesto (codigo).
- Como lo demostrarias en el navegador (pista: StrictMode es tu amigo).

## Criterios de aceptacion

- [ ] Las 5 entradas: 3 bugs y 2 malas practicas.
- [ ] Cada entrada cita el concepto que la justifica, no solo «esto esta mal».
- [ ] Los arreglos no introducen estado nuevo donde bastaba derivar.
- [ ] Sabes reproducir en vivo al menos 2 de los defectos.

(?) `Leaderboard.jsx` no esta en el material bajado: se proyecto en clase. Hace falta conseguirlo (Blackboard, la Arena o un companero) para hacer la review.
